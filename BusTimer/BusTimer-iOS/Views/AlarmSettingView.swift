import SwiftUI

struct AlarmSettingView: View {
    let stationName: String
    let busNumber: String
    @Environment(\.presentationMode) var presentationMode
    
    @State private var selectedCondition = "5분 전"
    let conditions = ["2분 전", "3분 전", "5분 전", "10분 전", "1정거장 전", "2정거장 전"]
    
    var body: some View {
        VStack(spacing: 30) {
            
            HeaderView(stationName: stationName, busNumber: busNumber)
                .padding(.top, 40)
            
            VStack(alignment: .leading, spacing: 10) {
                Text("언제 알려드릴까요?")
                    .font(.title2.bold())
                    .padding(.horizontal)
                
                // 크고 둥근 피커 스타일 카드
                Picker("알람 조건", selection: $selectedCondition) {
                    ForEach(conditions, id: \.self) { condition in
                        Text(condition).tag(condition)
                    }
                }
                .pickerStyle(WheelPickerStyle())
                .frame(height: 150)
                .background(Color(.systemGray6))
                .cornerRadius(20)
                .padding(.horizontal)
            }
            
            Spacer()
            
            Button(action: {
                // TODO: ViewModel을 통해 루틴 저장 처리 및 HomeView 업데이트
                print("저장 완료: \(busNumber), \(selectedCondition)")
                // 저장이 끝나면 Root View로 돌아가는 방식 (가단한 Dismiss 연달아 호출 혹은 NavigationUtil 사용)
                presentationMode.wrappedValue.dismiss()
            }) {
                Text("이 조건으로 알람 만들기")
                    .font(.title3.bold())
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(16)
            }
            .padding(.horizontal)
            .padding(.bottom, 20)
        }
        .navigationTitle("알람 조건 설정")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// 상단 정보 헤더 컴포넌트
struct HeaderView: View {
    let stationName: String
    let busNumber: String
    
    var body: some View {
        VStack {
            Text(stationName)
                .font(.headline)
                .foregroundColor(.secondary)
            HStack(alignment: .bottom, spacing: 4) {
                Text(busNumber)
                    .font(.system(size: 40, weight: .heavy, design: .rounded))
                Text("번 버스")
                    .font(.title2)
                    .padding(.bottom, 6)
            }
        }
    }
}

struct AlarmSettingView_Previews: PreviewProvider {
    static var previews: some View {
        AlarmSettingView(stationName: "부천시청역", busNumber: "1301")
    }
}
