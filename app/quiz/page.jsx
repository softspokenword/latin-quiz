'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Box, 
    Button, 
    Typography, 
    Paper, 
    Card, 
    CardContent, 
    LinearProgress,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl
} from '@mui/material';
import { QuizGenerator } from '../../utils';

export default function Quiz() {
    const router = useRouter();
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quizSettings, setQuizSettings] = useState(null);

    useEffect(() => {
        // Load quiz settings from localStorage
        const settings = localStorage.getItem('quizSettings');
        if (!settings) {
            router.push('/');
            return;
        }

        const parsedSettings = JSON.parse(settings);
        setQuizSettings(parsedSettings);

        // Generate quiz questions
        const generator = new QuizGenerator(parsedSettings);
        const generatedQuestions = generator.generateQuiz();
        setQuestions(generatedQuestions);
        setLoading(false);
    }, [router]);

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
    };

    const handleNext = () => {
        // Record the answer
        const newAnswer = {
            questionId: questions[currentQuestion].id,
            question: questions[currentQuestion].question,
            selectedAnswer,
            correctAnswer: questions[currentQuestion].correctAnswer,
            isCorrect: selectedAnswer === questions[currentQuestion].correctAnswer,
            questionData: questions[currentQuestion]
        };
        
        setAnswers([...answers, newAnswer]);
        setSelectedAnswer('');

        // Move to next question or finish quiz
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Quiz finished, go to results
            const finalAnswers = [...answers, newAnswer];
            localStorage.setItem('quizAnswers', JSON.stringify(finalAnswers));
            router.push('/results');
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            // Restore previous answer
            if (answers.length > currentQuestion - 1) {
                setSelectedAnswer(answers[currentQuestion - 1].selectedAnswer);
            }
        }
    };

    if (loading || !questions.length) {
        return (
            <Box className="min-h-screen flex items-center justify-center">
                <Paper className="p-8">
                    <Typography variant="h5">Loading quiz...</Typography>
                </Paper>
            </Box>
        );
    }

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <Box className="min-h-screen flex items-center justify-center p-4">
            <Paper elevation={3} className="p-8 max-w-4xl w-full bg-white">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <Typography variant="h4" className="text-blue-900">
                            Latin Quiz
                        </Typography>
                        <Typography variant="h6" className="text-gray-600">
                            Question {currentQuestion + 1} of {questions.length}
                        </Typography>
                    </div>
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        className="mb-4"
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                </div>

                <Card className="mb-8 bg-blue-50">
                    <CardContent>
                        <Typography variant="h5" className="text-center mb-6 text-blue-900">
                            {question.question}
                        </Typography>
                        
                        <FormControl component="fieldset" className="w-full">
                            <RadioGroup
                                value={selectedAnswer}
                                onChange={(e) => handleAnswerSelect(e.target.value)}
                                className="space-y-3"
                            >
                                {question.options.map((option, index) => (
                                    <FormControlLabel
                                        key={index}
                                        value={option}
                                        control={<Radio color="primary" />}
                                        label={
                                            <Typography variant="body1" className="text-lg">
                                                {option.startsWith('-') ? option : `-${option}`}
                                            </Typography>
                                        }
                                        className="bg-white p-4 rounded-lg border hover:bg-gray-50 mx-0"
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </CardContent>
                </Card>

                <div className="flex justify-between">
                    <Button
                        variant="outlined"
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="px-6 py-2"
                    >
                        Previous
                    </Button>
                    
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={!selectedAnswer}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
                    >
                        {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
                    </Button>
                </div>
            </Paper>
        </Box>
    );
}
