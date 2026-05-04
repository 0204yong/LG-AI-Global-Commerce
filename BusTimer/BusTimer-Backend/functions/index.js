const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

// 환경변수나 Secret Manager에서 관리될 API 키
const GYEONGGI_BUS_API_KEY = process.env.GYEONGGI_BUS_API_KEY || "YOUR_API_KEY";

/**
 * 1. 주기적으로 실행되는 폴링 워커 (Pub/Sub Schedule 사용 - 1분 간격)
 * 등록된 사용자 루틴들을 모두 가져온 뒤 고유 정류장ID 별로 버스 도착정보를 조회합니다.
 */
exports.pollBusArrivalInformation = functions.pubsub
    .schedule("every 1 minutes")
    .onRun(async (context) => {
        console.log("경기도 버스 API 데이터 확인 시작");
        
        try {
            const db = admin.firestore();
            
            // 1. 활성화(isActive = true)된 사용자 루틴 스냅샷 가져오기
            const routinesSnapshot = await db.collection("busRoutines").where("isActive", "==", true).get();
            if (routinesSnapshot.empty) {
                console.log("알람이 활성화된 루틴이 없습니다.");
                return null;
            }
            
            // TODO: 정류장ID(stationId) 별로 그룹화하여 API 호출 최소화 로직 필요
            // -> 경기도 API '정류장소속 노선별 도착예상시간' 호출 (API: http://apis.data.go.kr/6410000/busarrivalinfo/getBusArrivalList)
            
            // 임시: 순회하며 로직 처리 구조
            for (const doc of routinesSnapshot.docs) {
                const routine = doc.data();
                
                // 가상의 로직: 서버에서 조건("5분 전" 등)을 달성했다면 푸시 알림 발송 큐에 넣음
                const isConditionMet = checkArrivalConditionMock(routine);
                if (isConditionMet) {
                    await sendPushNotification(routine);
                    // 알람 발송 후엔 해당 루틴을 OFF 상태로 변경(일회성 알람)
                    await doc.ref.update({ isActive: false });
                }
            }
        } catch (error) {
            console.error("폴링 워커 중 에러 발생:", error);
        }
        
        return null;
    });

/**
 * 2. 도착 기준 모의 판단 로직 (추후 공공데이터 파싱으로 교체)
 */
function checkArrivalConditionMock(routine) {
    // 임시로 항상 조건 발동 (개발 단계 테스트용)
    // 예: 타겟 버스의 predictTime1(첫번째 도착예상시간)이 routine.alarmCondition 과 일치하는지 판별
    return true; 
}

/**
 * 3. FCM / APNs 경유 푸시 알림 발생
 */
async function sendPushNotification(routine) {
    const payload = {
        notification: {
            title: "버스타이머 도착 안내",
            body: `[${routine.busNumber}]번 버스가 [${routine.stationName}] 정류장에 곧 도착합니다! 지금 나가세요.`,
        },
        token: routine.deviceToken // iOS 앱에서 등록한 APNs -> FCM 매핑 토큰
    };
    
    try {
        const response = await admin.messaging().send(payload);
        console.log("알림 전송 성공:", response);
    } catch (error) {
        console.log("알림 전송 실패:", error);
    }
}
