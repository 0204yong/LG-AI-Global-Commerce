import Foundation
import Combine

class BusRoutineViewModel: ObservableObject {
    @Published var routines: [BusRoutine] = []
    
    init() {
        // 더미 데이터 초기화 (추후 Firestore 또는 UserDefaults에서 로드)
        loadMockData()
    }
    
    func loadMockData() {
        self.routines = [
            BusRoutine(stationName: "부천시청역.포도마을", stationId: "210000001", busNumber: "1301", busRouteId: "210000010", alarmCondition: "5분 전", isActive: false),
            BusRoutine(stationName: "상동역.세이브존", stationId: "210000002", busNumber: "7-2", busRouteId: "210000020", alarmCondition: "2정거장 전", isActive: true)
        ]
    }
    
    func toggleRoutine(for id: UUID) {
        if let index = routines.firstIndex(where: { $0.id == id }) {
            routines[index].isActive.toggle()
            let routine = routines[index]
            
            if routine.isActive {
                // 알림 켜짐 -> Mock 알림 스케줄링 로직 실행
                print("\(routine.busNumber) 버스 알림 ON")
                LocalPushManager.shared.scheduleMockNotification(for: routine)
                // TODO: Firebase로 푸시 조건 전송 및 백그라운드 등록
            } else {
                // 알림 꺼짐 -> 대기중인 알림 취소
                print("\(routine.busNumber) 버스 알림 OFF")
                LocalPushManager.shared.cancelNotification(for: routine.id)
                // TODO: Firebase에 푸시 조건 취소 요청
            }
        }
    }
}
