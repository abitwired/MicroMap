import { ipcMain, ContextBridge } from "electron";

export {};
declare global {
  // eslint-disable-next-line no-var
  var share: {
    ipcMain: typeof ipcMain;
  };
  interface Window {
    electron: ContextBridge;
  }
}

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    popover?: string;
    popovertarget?: string;
  }
}
