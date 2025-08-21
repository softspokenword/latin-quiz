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
    Divider,
    Chip
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';

export default function Results() {
    const router = useRouter();
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load quiz answers from localStorage
        const quizAnswers = localStorage.getItem('quizAnswers');
        if (!quizAnswers) {
            router.push('/');
            return;
        }

        const parsedAnswers = JSON.parse(quizAnswers);
        setAnswers(parsedAnswers);
        
        const correctAnswers = parsedAnswers.filter(answer => answer.isCorrect).length;
        setScore(Math.round((correctAnswers / parsedAnswers.length) * 100));
        setLoading(false);

        // Clean up localStorage
        // localStorage.removeItem('quizAnswers');
    }, [router]);

    const handleRetakeQuiz = () => {
        router.push('/quiz');
    };

    const handleNewQuiz = () => {
        router.push('/');
    };

    if (loading) {
        return (
            <Box className="min-h-screen flex items-center justify-center">
                <Paper className="p-8">
                    <Typography variant="h5">Loading results...</Typography>
                </Paper>
            </Box>
        );
    }

    const correctAnswers = answers.filter(answer => answer.isCorrect).length;
    const incorrectAnswers = answers.length - correctAnswers;

    return (
        <Box className="min-h-screen py-8 px-4">
            <Paper elevation={3} className="max-w-4xl mx-auto p-8 bg-white">
                <div className="text-center mb-8">
                    <Typography variant="h3" className="text-blue-900 mb-4">
                        Quiz Results
                    </Typography>
                    <div className="flex justify-center items-center space-x-8 mb-6">
                        <div className="text-center">
                            <Typography variant="h2" className="text-green-600 font-bold">
                                {score}%
                            </Typography>
                            <Typography variant="h6" className="text-gray-600">
                                Overall Score
                            </Typography>
                        </div>
                        <div className="text-center">
                            <Typography variant="h4" className="text-green-600">
                                {correctAnswers}
                            </Typography>
                            <Typography variant="body1" className="text-gray-600">
                                Correct
                            </Typography>
                        </div>
                        <div className="text-center">
                            <Typography variant="h4" className="text-red-600">
                                {incorrectAnswers}
                            </Typography>
                            <Typography variant="body1" className="text-gray-600">
                                Incorrect
                            </Typography>
                        </div>
                    </div>
                </div>

                <Divider className="mb-6" />

                {incorrectAnswers > 0 && (
                    <div className="mb-8">
                        <Typography variant="h5" className="text-red-600 mb-4">
                            Questions You Got Wrong
                        </Typography>
                        <div className="space-y-4">
                            {answers.filter(answer => !answer.isCorrect).map((answer, index) => (
                                <Card key={index} className="bg-red-50 border border-red-200">
                                    <CardContent>
                                        <div className="flex items-start justify-between mb-2">
                                            <Typography variant="h6" className="text-red-800">
                                                {answer.question}
                                            </Typography>
                                            <Cancel className="text-red-600" />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Chip 
                                                    label={`Your answer: ${answer.selectedAnswer}`}
                                                    color="error"
                                                    variant="outlined"
                                                    className="mb-2"
                                                />
                                            </div>
                                            <div>
                                                <Chip 
                                                    label={`Correct answer: ${answer.correctAnswer}`}
                                                    color="success"
                                                    variant="outlined"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {correctAnswers > 0 && (
                    <div className="mb-8">
                        <Typography variant="h5" className="text-green-600 mb-4">
                            Questions You Got Right
                        </Typography>
                        <div className="space-y-2">
                            {answers.filter(answer => answer.isCorrect).map((answer, index) => (
                                <Card key={index} className="bg-green-50 border border-green-200">
                                    <CardContent className="py-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Typography variant="body1" className="text-green-800">
                                                    {answer.question}
                                                </Typography>
                                                <Chip 
                                                    label={`Answer: ${answer.correctAnswer}`}
                                                    color="success"
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </div>
                                            <CheckCircle className="text-green-600" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-center space-x-4 mt-8">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRetakeQuiz}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700"
                    >
                        Regenerate Quiz
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleNewQuiz}
                        className="px-6 py-3"
                    >
                        New Quiz Settings
                    </Button>
                </div>
            </Paper>
        </Box>
    );
}
