export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Course {
    id: string;
    title: string;
    cefrLevel: CEFRLevel;
    description: string;
    thumbnailUrl: string;
    isPublished: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    modules?: CourseModule[];
}

export interface CourseModule {
    id: string;
    courseId: string;
    title: string;
    orderIndex: number;
    lessons?: Lesson[];
}

export interface Lesson {
    id: string;
    moduleId: string;
    title: string;
    contentType: 'video' | 'reading' | 'speaking' | 'listening';
    contentData: any;
    orderIndex: number;
}

export type GoetheModule = 'hören' | 'lesen' | 'schreiben' | 'sprechen';

export interface MockExam {
    id: string;
    title: string;
    cefrLevel: CEFRLevel;
    durationMins: number;
    isPublished: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    sections?: ExamSection[];
}

export interface ExamSection {
    id: string;
    mockExamId: string;
    moduleType: GoetheModule;
    content: any;
    maxScore: number;
}

export interface ExamSubmission {
    id: string;
    studentId: string;
    mockExamId: string;
    scoreLesen: number | null;
    scoreHoren: number | null;
    scoreSchreibung: number | null;
    scoreSprechen: number | null;
    teacherFeedback: string | null;
    status: 'submitted' | 'grading' | 'graded';
    createdAt?: Date;
    updatedAt?: Date;
}
