import { ChangeEventHandler, type FC } from "react";
import { useTheme } from "next-themes";

type Props = {
  id: string;
  mounted: boolean;
  checked: boolean;
  onChange: ChangeEventHandler;
};

const Checkbox: FC<Props> = ({ id, mounted, checked, onChange }) => {
  const { resolvedTheme } = useTheme();

  if (!mounted) return null;

  return (
    <div className="relative h-full w-full">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="absolute inset-0 z-10 cursor-pointer opacity-0"
      />
      <div className="absolute inset-0">
        {/* Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. */}
        {/* Modifications have been made from the original */}
        {resolvedTheme !== "dark" ? (
          checked ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <defs>
                <linearGradient id="grad1" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#404040" />
                  <stop offset="100%" stopColor="#B91C1C" />
                </linearGradient>
              </defs>
              <path
                fill="url(#grad1)"
                d="M400 480H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm-204.7-98.1l184-184c6.2-6.2 6.2-16.4 0-22.6l-22.6-22.6c-6.2-6.2-16.4-6.2-22.6 0L184 302.7l-70.1-70.1c-6.2-6.2-16.4-6.2-22.6 0l-22.6 22.6c-6.2 6.2-6.2 16.4 0 22.6l104 104c6.2 6.3 16.4 6.3 22.6 0z"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#6B7280"
                d="M 400,480 H 48 C 21.5,480 0,458.5 0,432 V 80 C 0,53.5 21.5,32 48,32 h 352 c 26.5,0 48,21.5 48,48 v 352 c 0,26.5 -21.5,48 -48,48 z"
              />
              <path
                d="M 373.28524,446 H 74.714765 C 52.236647,446 34,427.7634 34,405.28572 V 106.71428 C 34,84.2366 52.236647,66 74.714765,66 H 373.28524 C 395.76335,66 414,84.2366 414,106.71428 V 405.28572 C 414,427.7634 395.76335,446 373.28524,446 Z"
                fill="#F3F4F6"
              />
            </svg>
          )
        ) : checked ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <defs>
              <linearGradient id="grad1" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#FFF" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>
            <path
              fill="url(#grad1)"
              d="M400 480H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm-204.7-98.1l184-184c6.2-6.2 6.2-16.4 0-22.6l-22.6-22.6c-6.2-6.2-16.4-6.2-22.6 0L184 302.7l-70.1-70.1c-6.2-6.2-16.4-6.2-22.6 0l-22.6 22.6c-6.2 6.2-6.2 16.4 0 22.6l104 104c6.2 6.3 16.4 6.3 22.6 0z"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#6B7280"
              d="M 400,480 H 48 C 21.5,480 0,458.5 0,432 V 80 C 0,53.5 21.5,32 48,32 h 352 c 26.5,0 48,21.5 48,48 v 352 c 0,26.5 -21.5,48 -48,48 z"
            />
            <path
              d="M 373.28524,446 H 74.714765 C 52.236647,446 34,427.7634 34,405.28572 V 106.71428 C 34,84.2366 52.236647,66 74.714765,66 H 373.28524 C 395.76335,66 414,84.2366 414,106.71428 V 405.28572 C 414,427.7634 395.76335,446 373.28524,446 Z"
              fill="#525252"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default Checkbox;
