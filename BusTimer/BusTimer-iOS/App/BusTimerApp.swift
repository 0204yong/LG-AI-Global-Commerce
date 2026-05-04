import SwiftUI

@main
struct BusTimerApp: App {
    
    init() {
        // 앱 시작 시 로컬 알림(권한)을 요청합니다.
        // 현재는 Apple Developer 계정 없이도 푸시 UX를 테스트하기 위해 로컬 알림을 사용합니다.
        LocalPushManager.shared.requestAuthorization()
    }
    
    var body: some Scene {
        WindowGroup {
            HomeView()
                // 기획에 맞추어 기본적으로 다크모드로 설정 또는 시스템 설정에 따르게 할 수 있습니다. 
                // .preferredColorScheme(.dark) 
        }
    }
}
