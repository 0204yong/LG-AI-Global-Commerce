import SwiftUI

struct RoutineCardView: View {
    let routine: BusRoutine
    let onToggle: () -> Void
    
    var body: some View {
        HStack(spacing: 20) {
            VStack(alignment: .leading, spacing: 8) {
                Text(routine.stationName)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                HStack(alignment: .bottom) {
                    Text(routine.busNumber)
                        .font(.system(size: 34, weight: .bold, design: .rounded))
                        .foregroundColor(.primary)
                    Text("번 버스")
                        .font(.headline)
                        .foregroundColor(.primary)
                        .padding(.bottom, 4)
                }
                
                Text(routine.alarmCondition)
                    .font(.caption)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(Color.blue.opacity(0.15))
                    .foregroundColor(.blue)
                    .cornerRadius(8)
            }
            
            Spacer()
            
            // 큼직한 토글 스위치 (Toss / Apple 기본 알람 앱 스타일)
            Toggle("", isOn: Binding(
                get: { routine.isActive },
                set: { _ in onToggle() }
            ))
            .labelsHidden()
            .scaleEffect(1.3) // 토글 크기를 조금 더 키움
        }
        .padding(24)
        .background(Color(.systemGray6)) // 다크모드 대응 배경
        .cornerRadius(24)
        .shadow(color: Color.black.opacity(0.05), radius: 10, x: 0, y: 5)
    }
}

struct RoutineCardView_Previews: PreviewProvider {
    static var previews: some View {
        RoutineCardView(
            routine: BusRoutine(stationName: "부천시청역", stationId: "123", busNumber: "1301", busRouteId: "456", alarmCondition: "5분 전", isActive: true),
            onToggle: {}
        )
        .padding()
        .previewLayout(.sizeThatFits)
    }
}
