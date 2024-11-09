"use client";
import React, { useState, useEffect } from 'react';
import { Timer, Download, Plus, Minus, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ClimbingTracker = () => {
  const PHASES = ['Warm Up', 'Climbing', 'Rehab exercises', 'Complete'];
  const [currentPhase, setCurrentPhase] = useState(null);
  const [phaseTimes, setPhaseTimes] = useState({
    'Warm Up': 0,
    'Climbing': 0,
    'Rehab exercises': 0
  });
  const [phaseStartTime, setPhaseStartTime] = useState(null);
  const [showWeightPage, setShowWeightPage] = useState(false);
  const [weight, setWeight] = useState(135);
  const [subject, setSubject] = useState('Mike');
  
  const [session, setSession] = useState({
    startTime: null,
    moves: 0,
    grades: {
      'V5-V6': { attempts: 0, sends: 0 },
      'V7-V8': { attempts: 0, sends: 0 },
      'V9-V10': { attempts: 0, sends: 0 },
      'V11+': { attempts: 0, sends: 0 }
    },
    oppositionSets: 0,
    fingerboardWeight: 0
  });

  useEffect(() => {
    let interval;
    if (currentPhase && currentPhase !== 'Complete' && phaseStartTime) {
      interval = setInterval(() => {
        const newElapsed = Math.floor((Date.now() - phaseStartTime) / 1000);
        setPhaseTimes(prev => ({
          ...prev,
          [currentPhase]: newElapsed
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentPhase, phaseStartTime]);

  const incrementMoves = () => {
    setSession(prev => ({
      ...prev,
      moves: prev.moves + 1
    }));
  };

  const handlePhaseChange = () => {
    if (!currentPhase) {
      setCurrentPhase(PHASES[0]);
      setPhaseStartTime(Date.now());
      setSession(prev => ({ ...prev, startTime: Date.now() }));
    } else {
      const currentIndex = PHASES.indexOf(currentPhase);
      if (currentIndex < PHASES.length - 1) {
        setCurrentPhase(PHASES[currentIndex + 1]);
        setPhaseStartTime(Date.now());
      }
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalTime = () => {
    return Object.values(phaseTimes).reduce((a, b) => a + b, 0);
  };

  // Weight options generation
  const weightOptions = Array.from({ length: 41 }, (_, i) => i + 115);

  // Weight tracking page
  if (showWeightPage) {
    return (
      <Card className="max-w-2xl mx-auto p-4">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Weight Tracking</span>
            <button 
              onClick={() => setShowWeightPage(false)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white"
            >
              Back to Session
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center space-x-8">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={subject === 'Mike'}
                onChange={() => setSubject('Mike')}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-lg">Mike</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={subject === 'Patti'}
                onChange={() => setSubject('Patti')}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-lg">Patti</span>
            </label>
          </div>

          <div className="flex flex-col items-center gap-4">
            <User className="w-12 h-12 text-gray-400" />
            <div className="text-xl font-bold">{subject}'s Weight</div>
            <select 
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="p-2 border rounded-lg text-2xl w-32 text-center"
            >
              {weightOptions.map(w => (
                <option key={w} value={w}>{w} lbs</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Main session tracking page
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Climbing Session Tracker - {subject}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowWeightPage(true)}
                className="px-4 py-2 rounded-lg bg-gray-500 text-white"
              >
                Weight Log
              </button>
              <button 
                onClick={handlePhaseChange}
                className={`px-4 py-2 rounded-lg ${
                  !currentPhase ? 'bg-green-500' : 
                  currentPhase === 'Complete' ? 'bg-gray-500' : 'bg-blue-500'
                } text-white`}
              >
                {!currentPhase ? 'Start Session' : 
                 currentPhase === 'Complete' ? 'Session Complete' : `Stop ${currentPhase}`}
              </button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Phase Timers Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {Object.entries(phaseTimes).map(([phase, time]) => (
              <div key={phase} 
                className={`p-2 rounded-lg ${
                  currentPhase === phase ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'
                }`}
              >
                <div className="text-sm font-medium">{phase}</div>
                <div className="text-lg">{formatTime(time)}</div>
              </div>
            ))}
          </div>

          {currentPhase === 'Complete' && (
            <div className="p-4 bg-green-100 rounded-lg mb-4">
              <div className="text-lg font-bold">Total Session Time</div>
              <div className="text-2xl">{formatTime(getTotalTime())}</div>
            </div>
          )}

          {currentPhase === 'Climbing' && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Moves</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSession(prev => ({
                        ...prev,
                        moves: Math.max(0, prev.moves - 1)
                      }))}
                      className="p-2 bg-gray-200 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-lg">{session.moves}</span>
                    <button
                      onClick={() => setSession(prev => ({
                        ...prev,
                        moves: prev.moves + 1
                      }))}
                      className="p-2 bg-gray-200 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(session.grades).map(([grade, data]) => (
                  <div key={grade} className="flex flex-col gap-2">
                    <div className="font-bold">{grade}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="text-sm">Attempts</div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSession(prev => ({
                                ...prev,
                                grades: {
                                  ...prev.grades,
                                  [grade]: {
                                    ...prev.grades[grade],
                                    attempts: Math.max(0, prev.grades[grade].attempts - 1)
                                  }
                                }
                              }));
                            }}
                            className="p-1 bg-gray-200 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{data.attempts}</span>
                          <button
                            onClick={() => {
                              setSession(prev => ({
                                ...prev,
                                grades: {
                                  ...prev.grades,
                                  [grade]: {
                                    ...prev.grades[grade],
                                    attempts: prev.grades[grade].attempts + 1
                                  }
                                }
                              }));
                              incrementMoves();  // Keep move increment for attempts
                            }}
                            className="p-1 bg-gray-200 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm">Sends</div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSession(prev => ({
                                ...prev,
                                grades: {
                                  ...prev.grades,
                                  [grade]: {
                                    ...prev.grades[grade],
                                    sends: Math.max(0, prev.grades[grade].sends - 1)
                                  }
                                }
                              }));
                            }}
                            className="p-1 bg-gray-200 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{data.sends}</span>
                          <button
                            onClick={() => {
                              setSession(prev => ({
                                ...prev,
                                grades: {
                                  ...prev.grades,
                                  [grade]: {
                                    ...prev.grades[grade],
                                    sends: prev.grades[grade].sends + 1
                                  }
                                }
                              }));
                              incrementMoves();  // Keep move increment for sends
                            }}
                            className="p-1 bg-gray-200 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {currentPhase === 'Warm Up' && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm mb-1">Fingerboard Weight (lbs)</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSession(prev => ({...prev, fingerboardWeight: Math.max(0, prev.fingerboardWeight - 5)}))}
                    className="p-1 bg-gray-200 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{session.fingerboardWeight}</span>
                  <button
                    onClick={() => setSession(prev => ({...prev, fingerboardWeight: prev.fingerboardWeight + 5}))}
                    className="p-1 bg-gray-200 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentPhase === 'Rehab exercises' && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm mb-1">Opposition Sets</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSession(prev => ({...prev, oppositionSets: Math.max(0, prev.oppositionSets - 1)}))}
                    className="p-1 bg-gray-200 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{session.oppositionSets}</span>
                  <button
                    onClick={() => setSession(prev => ({...prev, oppositionSets: prev.oppositionSets + 1}))}
                    className="p-1 bg-gray-200 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentPhase === 'Complete' && (
            <button
              className="mt-6 w-full p-4 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Session Data
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClimbingTracker;
