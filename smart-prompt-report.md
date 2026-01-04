# Smart Prompt & Human-in-the-Loop Workflow Report

## 1. Introduction
This report details the implementation of the "Smart Prompt & Human-in-the-Loop" workflow for the SmartDoc Teacher App. This workflow is designed to empower teachers by providing intelligent assistance from internal pedagogical databases while maintaining full user control over the final AI-generated content.

## 2. Workflow Overview
The workflow consists of five key steps:
1.  **Selection (Chọn khối & Chủ đề)**: Teacher selects the grade and topic.
2.  **Intelligent Lookup (Lookup database)**: The system automatically retrieves relevant data from multiple specialized databases.
3.  **Refinement (Điền & Chỉnh sửa)**: Teacher reviews and modifies the pre-filled data in structured textareas.
4.  **Prompt Generation (Tạo Prompt)**: The system constructs a comprehensive, expert-level prompt for Gemini Pro.
5.  **AI Interaction & Parsing (Gửi & Dán kết quả)**: Teacher sends the prompt to Gemini Pro manually and pastes the JSON result back for automatic parsing and population.
6.  **Export (Review & Word Export)**: Final review of the structured lesson plan and export to a professional Word document.

## 3. Technical Integration

### 3.1 Intelligent Database Lookup (`SmartPromptService`)
The `SmartPromptService` centralizes data retrieval from across the platform:
-   **Curriculum Database**: Extracts learning outcomes and core activities based on the "Kết nối tri thức" program.
-   **PPCT (Program Distribution)**: Fetches time allocation and theme structure.
-   **Digital Competency (NLS)**: Integrates Circular 02/2025/TT-BGDĐT requirements.
-   **Student Psychology**: Tailors pedagogical approaches to the specific grade level (10-12).
-   **Assessment Tools**: Recommends appropriate rubrics and learnign worksheets.
-   **Pedagogical Guides**: Ensures compliance with MOET CV5512 standards.

### 3.2 Expert Prompt Builder (`SmartPromptBuilder`)
The UI component providing:
-   **Auto-fill Capability**: Populates 7 distinct fields with specialized content.
-   **Dynamic Editing**: Allows teachers to inject their own teaching style and local context.
-   **Expert Prompt Construction**: Merges all refined inputs into a high-density instruction set for Gemini Pro, specifying role-play, structure, and output requirements.

### 3.3 Smart Content Parser (`LessonTab`)
The integration logic in `LessonTab` handles the "return" leg of the workflow:
-   **Direct JSON Parsing**: Attempts to parse the AI output immediately if it's in the requested JSON format.
-   **AI-Assisted Fallback**: Uses an internal parsing route for unstructured or broken content.
-   **Intelligent Mapping**: Distributes the parsed content across the `lessonResult` state, populating all 5512-required sections (Khởi động, Khám phá, Luyện tập, Vận dụng, SHDC, SHL, etc.).

### 3.4 Professional Word Export (`ExportService`)
A dedicated service utilizing the `docx` library to generate standard Word documents:
-   **Structural Integrity**: Matches the MOET 5512 layout exactly.
-   **Styled Outputs**: Implements professional typography, headings, and table structures.
-   **Automatic Population**: Directly maps the final reviewed `lessonResult` fields to the Word document sections.

## 4. Conclusion
The "Smart Prompt & Human-in-the-Loop" workflow significantly reduces the cognitive load on teachers while improving the pedagogical quality and standard compliance of lesson plans. By combining deep database integration with manual AI interaction, the system achieves a balance between automation and professional autonomy.
