package com.example.bustimer.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun RoutineCard(
    stationName: String,
    busNumber: String,
    alarmCondition: String,
    isActive: Boolean,
    onToggle: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp)
            .background(Color(0xFF1C1C1E), shape = RoundedCornerShape(24.dp))
            .padding(24.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = stationName,
                color = Color.LightGray,
                fontSize = 14.sp
            )
            Spacer(modifier = Modifier.height(4.dp))
            Row(verticalAlignment = Alignment.Bottom) {
                Text(
                    text = busNumber,
                    color = Color.White,
                    fontSize = 36.sp, // 시인성 강화를 위한 큼직한 폰트
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "번 버스",
                    color = Color.White,
                    fontSize = 18.sp,
                    modifier = Modifier.padding(start = 4.dp, bottom = 6.dp)
                )
            }
            Spacer(modifier = Modifier.height(10.dp))
            Surface(
                color = Color(0xFF0A84FF).copy(alpha = 0.2f),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(
                    text = alarmCondition,
                    color = Color(0xFF5AC8FA),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                )
            }
        }
        
        Spacer(modifier = Modifier.width(16.dp))
        
        // 크고 직관적인 토글 스위치 제공
        Switch(
            checked = isActive,
            onCheckedChange = onToggle,
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = Color(0xFF34C759)
            )
        )
    }
}
