import Foundation
import UserNotifications

class LocalPushManager {
    static let shared = LocalPushManager()
    
    private init() {}
    
    // 알림 권한 요청
    func requestAuthorization() {
        let options: UNAuthorizationOptions = [.alert, .sound, .badge]
        UNUserNotificationCenter.current().requestAuthorization(options: options) { granted, error in
            if let error = error {
                print("알림 권한 요청 에러: \(error.localizedDescription)")
            } else {
                print("알림 권한 허용 여부: \(granted)")
            }
        }
    }
    
    // 테스트용 모의 알림 스케줄링 (예: 5초 뒤 알람 발송)
    func scheduleMockNotification(for routine: BusRoutine) {
        let content = UNMutableNotificationContent()
        content.title = "버스타이머 알림"
        content.body = "[\(routine.busNumber)]번 버스가 \(routine.stationName)에 곧 도착합니다! 지금 나가세요."
        content.sound = .default
        
        // 5초 뒤 발송 (실제로는 서버 API 결과에 맞추어 동작해야 함)
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 5.0, repeats: false)
        let request = UNNotificationRequest(identifier: routine.id.uuidString, content: content, trigger: trigger)
        
        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("푸시 스케줄링 에러: \(error.localizedDescription)")
            } else {
                print("푸시 스케줄링 성공: \(routine.busNumber) 버스 알림이 5초 뒤에 도착합니다.")
            }
        }
    }
    
    // 예약된 기상 알람 취소
    func cancelNotification(for routineId: UUID) {
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [routineId.uuidString])
        print("푸시 스케줄링 취소: \(routineId)")
    }
}
