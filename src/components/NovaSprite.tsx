import novaImage from "@/assets/nova-guide-v4.png";

export function NovaSprite({ className = "" }: { className?: string }) {
  return (
    <span className={`nova-sprite ${className}`}>
      <span className="nova-name">NOVA</span>
      <img
        src={novaImage}
        alt="Nova, your smiling blue astronaut helper, wearing a white Team Diamonds spacesuit with a rocket pack"
        draggable={false}
      />
    </span>
  );
}
