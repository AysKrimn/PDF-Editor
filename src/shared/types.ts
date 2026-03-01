export type ObjectType = 'text' | 'image' | 'shape';

export type TextAlign = 'left' | 'center' | 'right';

export type ObjectFit = 'contain' | 'cover' | 'fill';

export interface BaseObjectData {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface TextObjectData extends BaseObjectData {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign: TextAlign;
  color: string;
}

export interface ImageObjectData extends BaseObjectData {
  type: 'image';
  src: string;
  opacity: number;
  objectFit: ObjectFit;
}

export interface ShapeObjectData extends BaseObjectData {
  type: 'shape';
}

export type EditorObject = TextObjectData | ImageObjectData | ShapeObjectData;
