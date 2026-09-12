import { useEffect } from "react";
import  {FONT_SOURCES}  from "../constants/theme.js";


function useFonts() {
  useEffect(() => {
    FONT_SOURCES.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const lnk = document.createElement("link");
        lnk.rel = "stylesheet";
        lnk.href = href;
        document.head.appendChild(lnk);
      }
    });
  }, []);

}

export default useFonts