import SwiftUI

struct SearchView: View {
    @Environment(\.presentationMode) var presentationMode
    @State private var searchQuery = ""
    @State private var searchResults: [String] = [] // 임시 데이터 (정류장 이름들)
    
    var body: some View {
        NavigationView {
            VStack {
                // 큼직한 검색 바
                TextField("정류장 이름 또는 번호를 검색하세요", text: $searchQuery)
                    .padding(16)
                    .font(.title3)
                    .background(Color(.systemGray6))
                    .cornerRadius(16)
                    .padding(.horizontal)
                    .padding(.top, 20)
                    .onChange(of: searchQuery) { newValue in
                        // 임시 모의 검색 로직
                        if newValue.count > 1 {
                            searchResults = ["\(newValue)역", "\(newValue)삼거리", "\(newValue)마을"]
                        } else {
                            searchResults = []
                        }
                    }
                
                List {
                    ForEach(searchResults, id: \.self) { result in
                        NavigationLink(destination: BusSelectionView(stationName: result)) {
                            Text(result)
                                .font(.body)
                                .padding(.vertical, 8)
                        }
                    }
                }
                .listStyle(PlainListStyle())
            }
            .navigationTitle("정류장 검색")
            .navigationBarItems(leading: Button("취소") {
                presentationMode.wrappedValue.dismiss()
            })
        }
    }
}

// 버스 선택 뷰 (정류장 선택 후)
struct BusSelectionView: View {
    let stationName: String
    
    var body: some View {
        VStack {
            List {
                NavigationLink(destination: AlarmSettingView(stationName: stationName, busNumber: "1301")) {
                    HStack {
                        Image(systemName: "bus.fill")
                            .foregroundColor(.red) // 광역버스 색상 예시
                            .font(.title2)
                        Text("1301")
                            .font(.title3.bold())
                        Spacer()
                        Text("서울역 방면")
                            .foregroundColor(.secondary)
                    }
                    .padding(.vertical, 10)
                }
            }
            .listStyle(InsetGroupedListStyle())
        }
        .navigationTitle("버스 선택")
    }
}

struct SearchView_Previews: PreviewProvider {
    static var previews: some View {
        SearchView()
    }
}
