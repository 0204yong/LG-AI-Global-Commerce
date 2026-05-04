import Foundation

// 버스루틴 (사용자 즐겨찾기) 데이터 모델
struct BusRoutine: Identifiable, Codable {
    var id = UUID()
    let stationName: String         // 예: "부천시청역"
    let stationId: String           // 공공데이터 정류장 ID
    let busNumber: String           // 예: "1234"
    let busRouteId: String          // 공공데이터 노선 ID
    var alarmCondition: String      // 예: "5분 전", "2정거장 전"
    var isActive: Bool              // 알람 켜짐/꺼짐 상태
}
