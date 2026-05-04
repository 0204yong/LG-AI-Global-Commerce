package com.example.bustimer.viewmodels

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import com.example.bustimer.ui.screens.BusRoutine

class BusRoutineViewModel : ViewModel() {

    // ViewModel에 의해 관리되는 루틴 리스트 StateFlow
    private val _routines = MutableStateFlow<List<BusRoutine>>(emptyList())
    val routines: StateFlow<List<BusRoutine>> = _routines.asStateFlow()

    init {
        loadMockRoutines()
    }

    private fun loadMockRoutines() {
        _routines.value = listOf(
            BusRoutine("1", "부천시청역.포도마을", "1301", "5분 전", false),
            BusRoutine("2", "상동역.세이브존", "7-2", "2정거장 전", true)
        )
    }

    fun toggleRoutine(routineId: String, isActive: Boolean) {
        val updatedList = _routines.value.map {
            if (it.id == routineId) {
                // 토글 로직
                // 여기서 Firebase 백엔드로 'Active' 상태를 쏘아주는 레포지토리 로직이 들어갑니다.
                it.copy(isActive = isActive)
            } else {
                it
            }
        }
        _routines.value = updatedList
    }
}
