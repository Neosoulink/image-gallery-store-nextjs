// Will provides all global types that app needed

/**
 * Modify properties type of a ``Type`` or ``Interface``
 *
 * i.e:
  ```javascript
  interface OriginalInterface {
    a: string;
    b: boolean;
    c: number;
  }

  type ModifiedType  = Modify<OriginalInterface , {
    a: number;
    b: number;
  }>

  // ModifiedType = { a: number; b: number; c: number; }
  ```
 */
export type ModifyPropertiesTypes<T, R> = Omit<T, keyof R> & R;
