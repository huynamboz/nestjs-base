export enum SessionStatus {
  PENDING = 'pending',           // Session được tạo nhưng chưa bắt đầu
  ACTIVE = 'active',             // Session đang chụp hình
  COMPLETED = 'completed',       // Session hoàn thành
  CANCELLED = 'cancelled',       // Session bị hủy
  EXPIRED = 'expired',           // Session hết hạn
}

export enum PhotoboothStatus {
  AVAILABLE = 'available',       // Photobooth sẵn sàng
  BUSY = 'busy',                 // Photobooth đang có session
  MAINTENANCE = 'maintenance',   // Photobooth đang bảo trì
  OFFLINE = 'offline',           // Photobooth offline
}
