// Định nghĩa cấu trúc cho Vật liệu (Materials)
export interface MaterialConfig {
  name: string;
  color?: number[];         // [R, G, B] từ 0 đến 1
  textureURL?: string;      // Đường dẫn ảnh
  texHasAlpha?: boolean;    // Có nền trong suốt không
  atlasIndex?: number;      // Nếu dùng chung 1 ảnh lớn (Sprite sheet)
}

// Định nghĩa cấu trúc cho Khối (Blocks)[cite: 1]
export interface BlockConfig {
  name: string;             // Tên định danh (vd: "dirt", "grass")
  material: string | string[]; // Tên vật liệu: "dirt" hoặc ["top", "bottom", "sides"]
  solid?: boolean;          // Có va chạm vật lý không (Mặc định: true)[cite: 1]
  opaque?: boolean;         // Có che khuất ánh sáng/block phía sau không (Mặc định: true)[cite: 1]
  fluid?: boolean;          // Có phải chất lỏng không (Mặc định: false)[cite: 1]
  fluidDensity?: number;    // Độ đặc của chất lỏng[cite: 1]
  viscosity?: number;       // Độ nhớt của chất lỏng[cite: 1]
}

// Cấu trúc file JSON tổng
export interface GameResources {
  materials: MaterialConfig[];
  blocks: BlockConfig[];
}