package com.example.bustimer.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.bustimer.ui.components.RoutineCard

// 더미 데이터 클래스 (ViewModel로 이동 예정)
data class BusRoutine(
    val id: String,
    val stationName: String,
    val busNumber: String,
    val alarmCondition: String,
    var isActive: Boolean
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen() {
    // 목업 데이터 모델 상태
    var routines by remember {
        mutableStateOf(
            listOf(
                BusRoutine("1", "부천시청역.포도마을", "1301", "5분 전", false),
                BusRoutine("2", "상동역.세이브존", "7-2", "2정거장 전", true)
            )
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("버스타이머", fontWeight = androidx.compose.ui.text.font.FontWeight.Bold) },
                actions = {
                    IconButton(onClick = { /* TODO: SearchScreen으로 이동 */ }) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "루틴 추가",
                            tint = Color(0xFF0A84FF),
                            modifier = Modifier.size(32.dp)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        }
    ) { paddingValues ->
        if (routines.isEmpty()) {
            EmptyStateView(modifier = Modifier.padding(paddingValues))
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(routines, key = { it.id }) { routine ->
                    RoutineCard(
                        stationName = routine.stationName,
                        busNumber = routine.busNumber,
                        alarmCondition = routine.alarmCondition,
                        isActive = routine.isActive,
                        onToggle = { isChecked ->
                            // 상태 토글 업데이트 로직
                            routines = routines.map { 
                                if (it.id == routine.id) it.copy(isActive = isChecked) else it 
                            }
                            // TODO: Firebase/로컬 알람 업데이트 트리거
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun EmptyStateView(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // 아이콘 대용 (Compose 내장 아이콘 활용 가능하나 빈 화면 강조 목적)
        Text(text = "🚌", fontSize = 60.sp)
        Spacer(modifier = Modifier.height(24.dp))
        Text(
            text = "등록된 알람이 없습니다.",
            style = MaterialTheme.typography.titleLarge,
            color = Color.White
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "우측 상단 '+' 버튼을 눌러\n매일 타는 버스를 등록해보세요.",
            style = MaterialTheme.typography.bodyMedium,
            color = Color.Gray,
            textAlign = TextAlign.Center
        )
    }
}
