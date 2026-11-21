import type { CSSProperties } from "react";
import { techBubbles } from "@/components/abismo/data";
import { TechIcon } from "@/components/shared/tech-icon";

/**
 * Capa fija a pantalla completa: burbujas con el icono de cada tecnología
 * que nacen en el borde inferior de la pantalla y suben todo el recorrido.
 */
export function TechBubbles() {
  return (
    <div className="ab-techlayer" aria-hidden="true">
      {techBubbles.map((bubble) => (
        <span
          key={bubble.name}
          className="ab-iconbubble"
          data-compact={bubble.compact}
          style={
            {
              left: bubble.left,
              width: `${bubble.size}rem`,
              height: `${bubble.size}rem`,
              animationDuration: `${bubble.duration}s`,
              animationDelay: `${bubble.delay}s`,
              "--dx": `${bubble.dx}px`,
            } as CSSProperties
          }
        >
          <TechIcon name={bubble.name} size={bubble.size * 0.62} />
        </span>
      ))}
    </div>
  );
}
