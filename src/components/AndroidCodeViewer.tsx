import React, { useState } from 'react';
import { Code2, Copy, Check, X, Layers, Database, Cpu, Layout, FileText } from 'lucide-react';

interface AndroidCodeViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidCodeViewer: React.FC<AndroidCodeViewerProps> = ({ isOpen, onClose }) => {
  const [activeFile, setActiveFile] = useState<string>('HomeScreen.kt');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const codeFiles: Record<string, { category: string; description: string; code: string }> = {
    'HomeScreen.kt': {
      category: 'Presentation (Jetpack Compose)',
      description: 'Material 3 Compose UI for Daily Mission, 7-step checklist, and progress indicators.',
      code: `package com.auramind.app.presentation.home

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.auramind.app.domain.model.DailyMission
import com.auramind.app.domain.model.UserProfile
import com.auramind.app.presentation.theme.*

@Composable
fun HomeScreen(
    onNavigateToGame: (String) -> Unit,
    onNavigateToSpeak: () -> Unit,
    onNavigateToMentor: () -> Unit,
    viewModel: HomeViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            AuraTopAppBar(
                level = uiState.profile.level,
                streak = uiState.profile.streak,
                xp = uiState.profile.xp
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                DailyMissionHeroCard(
                    mission = uiState.dailyMission,
                    completed = uiState.isDayCompleted,
                    onClaimReward = { viewModel.claimDailyReward() }
                )
            }

            item {
                SectionHeader(title = "TODAY'S TRAINING SYSTEM")
            }

            // 1. Mental Warmup
            item {
                WarmupCard(
                    warmup = uiState.dailyMission.warmup,
                    onAnswerSelected = { viewModel.submitWarmup(it) }
                )
            }

            // 2. Logic Challenge
            item {
                ActionCard(
                    stepNumber = 3,
                    title = "Logic Challenge: \${uiState.dailyMission.gameTitle}",
                    description = "Interactive deductive reasoning with deterministic verification.",
                    buttonText = "Play Game",
                    accentColor = AuraCyan,
                    onClick = { onNavigateToGame(uiState.dailyMission.gameType) }
                )
            }

            // 3. Spoken Articulation
            item {
                ActionCard(
                    stepNumber = 4,
                    title = "Speech Studio: Impromptu Articulation",
                    description = "Live Android SpeechRecognizer with WPM & pause analysis.",
                    buttonText = "Open Studio",
                    accentColor = AuraEmerald,
                    onClick = { onNavigateToSpeak() }
                )
            }
        }
    }
}`,
    },

    'AppDatabase.kt': {
      category: 'Data & Persistence (Room)',
      description: 'Room SQLite database schema, DAOs, and TypeConverters for offline synchronization.',
      code: `package com.auramind.app.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow
import java.util.Date

@Entity(tableName = "user_profiles")
data class UserProfileEntity(
    @PrimaryKey val id: String,
    val name: String,
    val goal: String,
    val dailyMinutes: Int,
    val difficulty: String,
    val selectedProgram: String,
    val currentDay: Int,
    val level: Int,
    val xp: Long,
    val streak: Int,
    val lastActiveDate: Long,
    val logicScore: Int,
    val wisdomScore: Int,
    val focusScore: Int,
    val expressionScore: Int,
    val empathyScore: Int,
    val composureScore: Int,
    val strategyScore: Int,
    val creativityScore: Int
)

@Dao
interface UserProfileDao {
    @Query("SELECT * FROM user_profiles WHERE id = :userId LIMIT 1")
    fun observeProfile(userId: String): Flow<UserProfileEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertProfile(profile: UserProfileEntity)

    @Query("UPDATE user_profiles SET xp = xp + :xpGain, level = :newLevel WHERE id = :userId")
    suspend fun awardXP(userId: String, xpGain: Long, newLevel: Int)
}

@Database(
    entities = [UserProfileEntity::class],
    version = 1,
    exportSchema = true
)
abstract class AuraDatabase : RoomDatabase() {
    abstract fun userProfileDao(): UserProfileDao
}`,
    },

    'AuraRepository.kt': {
      category: 'Domain & Clean Architecture',
      description: 'Repository interface and Hilt implementation connecting Room with Secure Gemini AI backend.',
      code: `package com.auramind.app.domain.repository

import com.auramind.app.domain.model.*
import kotlinx.coroutines.flow.Flow

interface AuraRepository {
    fun getProfile(): Flow<UserProfile>
    suspend fun saveProfile(profile: UserProfile)
    suspend fun awardXP(xp: Int, attribute: AuraAttribute?): UserProfile
    suspend fun getDailyMission(day: Int): DailyMission
    suspend fun requestSocraticFeedback(
        personaId: String,
        conversationHistory: List<ChatMessage>,
        userMessage: String
    ): Result<String>
    suspend fun analyzeSpokenTranscript(
        transcript: String,
        durationSeconds: Int
    ): Result<SpeechMetrics>
}`,
    },

    'build.gradle.kts': {
      category: 'Build System (Gradle Kotlin DSL)',
      description: 'Production Android app build configuration with Material 3, Hilt, Room, and WorkManager.',
      code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.kapt)
    alias(libs.plugins.hilt.android)
}

android {
    namespace = "com.auramind.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.auramind.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.14"
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.navigation.compose)

    // Hilt Dependency Injection
    implementation(libs.hilt.android)
    kapt(libs.hilt.compiler)

    // Room Database
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    kapt(libs.androidx.room.compiler)

    // WorkManager for Daily Scheduled Practice
    implementation(libs.androidx.work.runtime.ktx)

    // Coroutines & Flow
    implementation(libs.kotlinx.coroutines.android)
}`,
    },
  };

  const currentFileData = codeFiles[activeFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFileData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-[#090e1a] border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Native Android Studio & Kotlin Clean Architecture
              </h2>
              <p className="text-[11px] text-slate-400">
                Production-grade Android MVVM + Jetpack Compose + Hilt + Room architecture.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Android Code Inspector"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-slate-800/80 scrollbar-none">
          {Object.keys(codeFiles).map((fileName) => {
            const isSelected = activeFile === fileName;
            return (
              <button
                key={fileName}
                onClick={() => setActiveFile(fileName)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-semibold shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{fileName}</span>
              </button>
            );
          })}
        </div>

        {/* File Meta */}
        <div className="py-2.5 flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-emerald-400 font-mono">
              {currentFileData.category}
            </span>
            <span className="text-slate-400 ml-2">— {currentFileData.description}</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Source'}</span>
          </button>
        </div>

        {/* Code Editor Preview */}
        <div className="flex-1 bg-slate-950 border border-slate-800/90 rounded-xl p-4 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed">
          <pre>{currentFileData.code}</pre>
        </div>
      </div>
    </div>
  );
};
