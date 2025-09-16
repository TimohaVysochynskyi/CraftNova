import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect } from "react";
import { OrbitControls, useGLTF, PerspectiveCamera } from "@react-three/drei";
import { Group, Object3D, Vector3, Box3 } from "three";
import css from "./ModelController.module.css";

function MinecraftModel({ containerHeight }: { containerHeight: number }) {
  const groupRef = useRef<Group>(null);
  const headRef = useRef<Object3D>(null);
  const headPivotRef = useRef<Object3D>(null);
  const hairRef = useRef<Object3D>(null);
  const hairAttachedToPivot = useRef<boolean>(false);
  const rightArmRef = useRef<Object3D>(null);
  const { scene } = useGLTF("/models/auth-model.glb");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [originalRightArmRotation, setOriginalRightArmRotation] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);

  // Обчислюємо позицію моделі на основі висоти контейнера
  const modelYPosition = containerHeight > 0 ? -containerHeight * 0.0037 : -3;

  // Знаходимо голову, волосся та праву руку персонажа в моделі
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        const childName = child.name.toLowerCase();

        if (childName.includes("head")) {
          headRef.current = child;
        }

        if (childName.includes("hat")) {
          hairRef.current = child;
        }

        // Шукаємо праву руку (RightArm_8 з структури моделі)
        if (
          childName.includes("rightarm") ||
          childName.includes("right arm") ||
          childName.includes("arm_right")
        ) {
          rightArmRef.current = child;
          setOriginalRightArmRotation({
            x: child.rotation.x,
            y: child.rotation.y,
            z: child.rotation.z,
          });
          console.log(
            "Знайдено праву руку:",
            child.name,
            "Позиція:",
            child.position
          );
        }
      });

      // Створюємо шарнір (pivot) для голови в нижній центральній точці голови (як у майнкрафті)
      if (headRef.current && !headPivotRef.current) {
        const head = headRef.current as Object3D;
        const parent = head.parent as Object3D | null;
        if (parent) {
          // Оновлюємо матриці, щоб коректно отримати світові координати
          parent.updateWorldMatrix(true, false);
          head.updateWorldMatrix(true, false);

          // Обчислюємо світовий бокс голови, беремо нижній центр (точка шарніра)
          const worldBox = new Box3().setFromObject(head);
          const bottomCenterWorld = new Vector3(
            (worldBox.min.x + worldBox.max.x) / 2,
            worldBox.min.y,
            (worldBox.min.z + worldBox.max.z) / 2
          );

          // Переводимо точку шарніра у простір батька
          const bottomCenterParent = bottomCenterWorld.clone();
          parent.worldToLocal(bottomCenterParent);

          // Зберігаємо поточні світові позиції голови/волосся
          const headWorldPos = new Vector3();
          head.getWorldPosition(headWorldPos);
          let hairWorldPos: Vector3 | null = null;
          if (hairRef.current) {
            const hair = hairRef.current as Object3D;
            hair.updateWorldMatrix(true, false);
            hairWorldPos = new Vector3();
            hair.getWorldPosition(hairWorldPos);
          }

          // Створюємо pivot у точці шиї
          const pivot = new Object3D();
          pivot.name = "HeadPivot";
          // Minecraft-like: yaw (Y) then pitch (X)
          pivot.rotation.order = "YXZ";
          pivot.position.copy(bottomCenterParent);
          headPivotRef.current = pivot;

          // Додаємо pivot до батька
          parent.add(pivot);

          // Пересаджуємо голову під pivot, зберігаючи світову позицію
          pivot.add(head);
          head.position.copy(pivot.worldToLocal(headWorldPos.clone()));

          // Пересаджуємо волосся (hat) під той же pivot, теж зберігаючи світову позицію
          if (hairRef.current && hairWorldPos) {
            const hair = hairRef.current as Object3D;
            pivot.add(hair);
            hair.position.copy(pivot.worldToLocal(hairWorldPos.clone()));
            hairAttachedToPivot.current = true;
          }
        }
      }
    }
  }, [scene]);

  // Відстеження миші
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Анімація голови навколо коректного шарніра (pivot) та махання рукою
  useFrame((state) => {
    // Анімація голови
    if (headPivotRef.current) {
      // Майнкрафт кути обертання
      const targetYaw = mousePosition.x * Math.PI * 0.4; // ±45 градусів
      const targetPitch = mousePosition.y * Math.PI * 0.2; // ±13.5 градусів (зменшено у 4 рази)

      // Плавна інтерполяція обертання навколо шарніра (без будь-яких позиційних зміщень)
      headPivotRef.current.rotation.y +=
        (targetYaw - headPivotRef.current.rotation.y) * 0.15;
      headPivotRef.current.rotation.x +=
        (targetPitch - headPivotRef.current.rotation.x) * 0.15;
      headPivotRef.current.rotation.z = 0; // Фіксуємо Z-вісь
    }

    // Проста анімація підняття/опускання правої руки кожні 4 секунди
    if (rightArmRef.current && originalRightArmRotation) {
      const time = state.clock.elapsedTime;
      const cycleTime = time % 8; // Цикл кожні 8 секунди

      // Параметри анімації (легко налаштовувані)
      const liftAngle = Math.PI * 0.5;
      const forwardAngle = Math.PI * 0.3;
      const sidewaysAngle = Math.PI * -0.4;

      // Анімація триває 1.33 секунди (швидше в 1.5 рази), решту часу рука спокійна
      const animationDuration = 2; // 2 секунди
      if (cycleTime < animationDuration) {
        const animationProgress = cycleTime / animationDuration; // 0-1 протягом анімації

        let liftAmount;
        let waveAmount = 0;

        if (animationProgress < 0.3) {
          // Фаза 1: Підняття руки (0-30% часу)
          const liftProgress = animationProgress / 0.3;
          liftAmount = Math.sin(liftProgress * Math.PI * 0.5); // 0 -> 1
        } else if (animationProgress < 0.7) {
          // Фаза 2: Махання вгорі (30-70% часу)
          liftAmount = 1; // Рука залишається вгорі
          const waveProgress = (animationProgress - 0.3) / 0.4;
          waveAmount = Math.sin(waveProgress * Math.PI * 4) * 0.25; // Швидке махання
        } else {
          // Фаза 3: Опускання руки (70-100% часу)
          const lowerProgress = (animationProgress - 0.7) / 0.3;
          liftAmount = Math.cos(lowerProgress * Math.PI * 0.5); // 1 -> 0
        }

        // Застосовуємо обертання для привітання
        rightArmRef.current.rotation.set(
          originalRightArmRotation.x + liftAngle * liftAmount, // Піднімаємо руку вгору
          originalRightArmRotation.y - sidewaysAngle * liftAmount + waveAmount, // Відводимо в сторону + махання
          originalRightArmRotation.z + forwardAngle * liftAmount // Виносимо вперед до користувача
        );
      } else {
        // Повертаємо руку до оригінального положення
        rightArmRef.current.rotation.set(
          originalRightArmRotation.x,
          originalRightArmRotation.y,
          originalRightArmRotation.z
        );
      }
    }

    // Якщо волосся не було перепідʼєднане під pivot (fallback) — синхронізуємо вручну
    if (
      !hairAttachedToPivot.current &&
      hairRef.current &&
      headPivotRef.current
    ) {
      hairRef.current.rotation.copy(headPivotRef.current.rotation);
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      <primitive
        object={scene}
        scale={2.5}
        position={[0, modelYPosition, 0]}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
}

function ErrorFallback() {
  return (
    <div className={css.error}>
      <p>Помилка завантаження 3D моделі</p>
    </div>
  );
}

export default function ModelController({ height }: { height: number }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <ErrorFallback />;
  }

  return (
    <div
      className={css.container}
      style={{ height: height > 0 ? `${height}px` : "100%" }}
    >
      <Canvas
        className={css.canvas}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onError={() => setHasError(true)}
      >
        <Suspense fallback={null}>
          {/* Освітлення */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />

          {/* Камера */}
          <PerspectiveCamera makeDefault position={[0, 1, 5.5]} fov={60} />

          {/* Модель */}
          <MinecraftModel containerHeight={height} />

          {/* Контроли камери */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload моделі для кращої продуктивності
useGLTF.preload("/models/auth-model.glb");
