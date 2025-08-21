'use client';

import { useState } from 'react';
import { 
    Box, 
    Button, 
    FormControl, 
    FormGroup, 
    FormControlLabel, 
    Checkbox, 
    Typography, 
    Paper,
    RadioGroup,
    Radio,
    FormLabel
} from '@mui/material';
import { useRouter } from 'next/navigation';

const declensions = [
    { id: 1, label: '1st Declension' },
    { id: 2, label: '2nd Declension' },
    { id: 3, label: '3rd Declension' },
    { id: 4, label: '4th Declension' },
    { id: 5, label: '5th Declension' }
];

const cases = [
    { id: 'Nominative', label: 'Nominative' },
    { id: 'Vocative', label: 'Vocative' },
    { id: 'Accusative', label: 'Accusative' },
    { id: 'Genitive', label: 'Genitive' },
    { id: 'Dative', label: 'Dative' },
    { id: 'Ablative', label: 'Ablative' },
    { id: 'Locative', label: 'Locative' }
];

const quizLengths = [5, 10, 20];

export default function QuizSetup() {
    const router = useRouter();
    const [selectedDeclensions, setSelectedDeclensions] = useState([1]); // 1st selected by default
    const [selectedCases, setSelectedCases] = useState(['Nominative', 'Accusative', 'Genitive', 'Dative', 'Ablative']); // Default cases
    const [quizLength, setQuizLength] = useState(20);

    const handleDeclensionChange = (declensionId) => {
        setSelectedDeclensions(prev => 
            prev.includes(declensionId) 
                ? prev.filter(id => id !== declensionId)
                : [...prev, declensionId]
        );
    };

    const handleCaseChange = (caseId) => {
        setSelectedCases(prev => 
            prev.includes(caseId)
                ? prev.filter(id => id !== caseId)
                : [...prev, caseId]
        );
    };

    const startQuiz = () => {
        if (selectedDeclensions.length === 0 || selectedCases.length === 0) {
            alert('Please select at least one declension and one case.');
            return;
        }

        const quizSettings = {
            declensions: selectedDeclensions,
            cases: selectedCases,
            length: quizLength
        };

        // Store settings in localStorage and navigate to quiz
        localStorage.setItem('quizSettings', JSON.stringify(quizSettings));
        router.push('/quiz');
    };

    return (
        <Box className="min-h-screen flex items-center justify-center p-4 w-full" >
            <Paper elevation={3} className="p-8 max-w-2xl w-full bg-white">
                <Typography variant="h3" component="h1" gutterBottom className="text-center text-blue-900 mb-8">
                    Latin Declension Quiz
                </Typography>

                <div className="space-y-8">
                    {/* Declensions Selection */}
                    <FormControl component="fieldset" className="w-full">
                        <FormLabel component="legend" className="text-lg font-semibold text-gray-800 mb-4">
                            Select Declensions to Practice:
                        </FormLabel>
                        <FormGroup className="grid grid-cols-2 gap-2">
                            {declensions.map((declension) => (
                                <FormControlLabel
                                    key={declension.id}
                                    control={
                                        <Checkbox
                                            checked={selectedDeclensions.includes(declension.id)}
                                            onChange={() => handleDeclensionChange(declension.id)}
                                            color="primary"
                                        />
                                    }
                                    label={declension.label}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>

                    {/* Cases Selection */}
                    <FormControl component="fieldset" className="w-full">
                        <FormLabel component="legend" className="text-lg font-semibold text-gray-800 mb-4">
                            Select Cases to Practice:
                        </FormLabel>
                        <FormGroup className="grid grid-cols-2 gap-2">
                            {cases.map((case_) => (
                                <FormControlLabel
                                    key={case_.id}
                                    control={
                                        <Checkbox
                                            checked={selectedCases.includes(case_.id)}
                                            onChange={() => handleCaseChange(case_.id)}
                                            color="primary"
                                        />
                                    }
                                    label={case_.label}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>

                    {/* Quiz Length Selection */}
                    <FormControl component="fieldset" className="w-full">
                        <FormLabel component="legend" className="text-lg font-semibold text-gray-800 mb-4">
                            Quiz Length:
                        </FormLabel>
                        <RadioGroup
                            value={quizLength.toString()}
                            onChange={(e) => setQuizLength(parseInt(e.target.value))}
                            className="flex flex-row gap-8"
                        >
                            {quizLengths.map((length) => (
                                <FormControlLabel
                                    key={length}
                                    value={length.toString()}
                                    control={<Radio color="primary" />}
                                    label={`${length} questions`}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={startQuiz}
                        className="w-full mt-8 py-3 text-lg bg-blue-600 hover:bg-blue-700"
                    >
                        Start Quiz
                    </Button>
                </div>
            </Paper>
        </Box>
    );
}
