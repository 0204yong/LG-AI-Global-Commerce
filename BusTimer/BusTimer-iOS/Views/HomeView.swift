import SwiftUI

struct HomeView: View {
    @StateObject private var viewModel = BusRoutineViewModel()
    @State private var showSearchView = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    if viewModel.routines.isEmpty {
                        emptyStateView
                    } else {
                        ForEach(viewModel.routines) { routine in
                            RoutineCardView(routine: routine) {
                                withAnimation {
                                    viewModel.toggleRoutine(for: routine.id)
                                }
                            }
                        }
                    }
                }
                .padding()
            }
            .navigationTitle("버스타이머")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        showSearchView = true
                    }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(.blue)
                    }
                }
            }
            .sheet(isPresented: $showSearchView) {
                // 향후 추가될 SearchView로 연결
                Text("정류장/버스 검색 화면 준비 중")
            }
        }
    }
    
    var emptyStateView: some View {
        VStack(spacing: 16) {
            Image(systemName: "bus.fill")
                .font(.system(size: 60))
                .foregroundColor(.gray)
            Text("등록된 알람이 없습니다.")
                .font(.headline)
            Text("우측 상단 '+' 버튼을 눌러\n매일 타는 버스를 등록해보세요.")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding(.top, 100)
    }
}

struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView()
    }
}
