import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useAutoReadAloud } from '../../hooks/useAutoReadAloud';
import { useExerciseVoice } from '../../hooks/useExerciseVoice';
import { getTTSException } from '../../hooks/useGlobalTTS';
import { useSafeTimeouts } from '../../hooks/useSafeTimeouts';
import BionicText from '../common/BionicText';
import ExerciseControlsRow from '../common/ExerciseControlsRow';
import TTSController from '../common/TTSController';
import VoiceAnswerButton from '../common/VoiceAnswerButton';

function SyllableExercise({
  data,
  themeStyles,
  onSuccess,
  onError,
  language = 'en',
  t,
  speak,
  ttsFallback,
  noFlash = false,
  bigTargets = false,
  extendedTime = false,
  bionicReading = false,
  zenMode = false,
  voiceAssistant = false,
  isHighContrast = false,
}) {
  const [cuts, setCuts] = useState([]);
  const [isResolved, setIsResolved] = useState(false);

  const {
    isListening,
    transcript,
    startListening,
    error,
    voiceStatus,
    modelDownloadProgress,
    confirmModelDownload,
    declineModelDownload,
  } = useExerciseVoice(language, t);

  const [activeHighlight, setActiveHighlight] = useState(null);
  const {
    setSafeTimeout,
    clearAllTimeouts,
    pauseAllTimeouts,
    resumeAllTimeouts,
  } = useSafeTimeouts();

  const clearAudioTimeouts = useCallback(() => {
    clearAllTimeouts();
    setActiveHighlight(null);
  }, [clearAllTimeouts]);

  useEffect(() => {
    return () => {
      clearAudioTimeouts();
      window.speechSynthesis?.cancel();
    };
  }, [clearAudioTimeouts]);

  const charToSyl = useMemo(() => {
    if (!data.segments || !data.word) return [];
    const mapping = [];
    let currentSyl = 0;
    let charsInSyl = data.segments[0]?.length || 0;
    for (let i = 0; i < data.word.length; i++) {
      mapping.push(currentSyl);
      charsInSyl--;
      if (charsInSyl <= 0 && currentSyl < data.segments.length - 1) {
        currentSyl++;
        charsInSyl = data.segments[currentSyl]?.length || 0;
      }
    }
    return mapping;
  }, [data.segments, data.word]);

  const toggleCut = (index) => {
    if (isResolved) return;
    setCuts((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index].sort((a, b) => a - b),
    );
  };

  const checkAnswer = () => {
    if (!data.segments) return;
    const correctCuts = [];
    let pos = 0;
    for (let i = 0; i < data.segments.length - 1; i++) {
      pos += data.segments[i].length;
      correctCuts.push(pos);
    }

    if (JSON.stringify(cuts) === JSON.stringify(correctCuts)) {
      setIsResolved(true);
      playSyllables();
      setSafeTimeout(onSuccess, extendedTime ? 2500 : 1500);
    } else {
      onError();
      setCuts([]);
      setSafeTimeout(
        () => {
          playSyllables();
        },
        extendedTime ? 3500 : 2500,
      );
    }
  };

  // TTS engines routinely mispronounce syllable fragments spoken in
  // isolation — "chrzą" heard on its own sounds nothing like the "chrzą" in
  // "chrząszcz", and this holds across languages, not just Polish. Rather
  // than speak (and mispronounce) each segment separately, the audio always
  // plays the whole word once; the segment highlight still sweeps across
  // the word in order, timed proportionally to each segment's share of the
  // word's length, so the visual "here's where the cut happens" cue is
  // preserved without the garbled audio.
  const playSyllables = () => {
    if (!data.segments || !data.word) {
      speak(data.word, extendedTime);
      return;
    }
    clearAudioTimeouts();
    speak(data.word, extendedTime);

    const totalChars = data.word.length || 1;
    const totalDuration = totalChars * (extendedTime ? 90 : 65) + 600;
    let elapsed = 0;
    data.segments.forEach((syl, i) => {
      const share = syl.length / totalChars;
      const stepDuration = Math.max(totalDuration * share, 150);
      setSafeTimeout(() => setActiveHighlight(i), elapsed);
      setSafeTimeout(
        () => {
          setActiveHighlight((prev) => (prev === i ? null : prev));
        },
        elapsed + stepDuration - 50,
      );
      elapsed += stepDuration;
    });
  };

  // Wraps playSyllables (used as-is for the post-answer replay in
  // checkAnswer, where re-announcing the instruction every time would get
  // repetitive) with the task instruction, for the initial "what am I
  // supposed to do here" listen — both the manual TTSController button and
  // the automatic voiceAssistant read use this, not the bare playSyllables.
  const readInstructionAndSyllables = () => {
    clearAudioTimeouts();
    const instruction =
      t('syllableInstruction') || 'Divide the word into syllables';
    speak(instruction, extendedTime);
    const delay = instruction.length * (extendedTime ? 90 : 65) + 1200;
    setSafeTimeout(() => playSyllables(), delay);
  };

  useAutoReadAloud(voiceAssistant, readInstructionAndSyllables);

  const handleVoiceMatch = (num) => {
    if (num >= 1 && num < data.word.length) {
      toggleCut(num);
    } else {
      onError();
    }
  };

  const handleCommandMatch = (cmd) => {
    if (cmd === 'undo') setCuts([]);
    if (cmd === 'check') checkAnswer();
  };

  const wordChars = data.word.split('');

  const animClass = noFlash ? '' : 'animate-in fade-in zoom-in duration-500';
  const bounceClass = noFlash ? '' : 'animate-bounce';

  const wordLen = data.word?.length || 0;
  const isLong = wordLen > 12;
  const isVeryLong = wordLen > 18;

  const charSize = bigTargets
    ? isVeryLong
      ? 'text-2xl sm:text-4xl'
      : isLong
        ? 'text-3xl sm:text-5xl'
        : 'text-5xl sm:text-7xl'
    : isVeryLong
      ? 'text-lg sm:text-3xl'
      : isLong
        ? 'text-xl sm:text-4xl'
        : 'text-4xl sm:text-6xl';
  const btnPadding = bigTargets ? 'py-5 sm:py-6' : 'py-4 sm:py-5';
  // min-h, not h: the gap-number label used to sit outside this box
  // entirely (position: absolute, offset below it), which is exactly what
  // let it collide with letters/numbers on a wrapped line below it once a
  // long word wrapped to multiple lines on a narrow phone screen — flex-wrap
  // sizes each line from in-flow content only, so an absolutely positioned
  // label contributes nothing to line spacing and simply overlaps whatever
  // sits below. Rendering the number in-flow (below) needs the button to be
  // allowed to grow past this minimum rather than clip it.
  const cutHitbox = bigTargets
    ? isVeryLong
      ? 'w-6 min-h-10 sm:w-8 sm:min-h-12 mx-0'
      : isLong
        ? 'w-8 min-h-12 sm:w-10 sm:min-h-14 mx-0.5'
        : 'w-10 min-h-16 sm:w-14 sm:min-h-20 mx-1'
    : isVeryLong
      ? 'w-3 min-h-6 sm:w-6 sm:min-h-10 mx-0'
      : isLong
        ? 'w-5 min-h-8 sm:w-8 sm:min-h-12 mx-px'
        : 'w-8 min-h-12 sm:w-10 sm:min-h-16 mx-1';
  const controlBtnSize = bigTargets
    ? 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl'
    : 'w-12 h-12 sm:w-16 sm:h-16 text-xl sm:text-2xl';

  return (
    <div
      className={`${animClass} flex h-full min-h-0 w-full flex-col items-center justify-center overflow-hidden px-2 py-2`}
    >
      {}
      {!zenMode && (
        <h3
          className={`mb-2 shrink-0 text-center text-[10px] font-black tracking-[0.2em] uppercase sm:mb-4 ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
        >
          {t('syllableInstruction') || 'Divide the word into syllables'}
        </h3>
      )}

      {}
      <ExerciseControlsRow className="mb-2 flex shrink-0 gap-4 sm:mb-4 sm:gap-6">
        <div
          className={
            isResolved ? 'pointer-events-none opacity-50 grayscale' : ''
          }
        >
          <TTSController
            onReadAloud={readInstructionAndSyllables}
            pauseAllTimeouts={pauseAllTimeouts}
            resumeAllTimeouts={resumeAllTimeouts}
            controlBtnSize={controlBtnSize}
            noFlash={noFlash}
            ttsFallback={ttsFallback}
          />
        </div>

        <VoiceAnswerButton
          isListening={isListening}
          onStart={() => startListening(handleVoiceMatch, handleCommandMatch)}
          disabled={isResolved}
          error={error}
          t={t}
          themeStyles={themeStyles}
          noFlash={noFlash}
          bigTargets={bigTargets}
          isHighContrast={isHighContrast}
          bionicReading={bionicReading}
          voiceStatus={voiceStatus}
          modelDownloadProgress={modelDownloadProgress}
          confirmModelDownload={confirmModelDownload}
          declineModelDownload={declineModelDownload}
          controlBtnSize={controlBtnSize}
          idleLabel={t('speakGapNumber')}
        />
      </ExerciseControlsRow>

      {transcript ? (
        <p className="mb-1 shrink-0 text-center text-[10px] font-black tracking-widest text-slate-600 uppercase sm:mb-2 sm:text-xs">
          {t('heard')}: <span className="text-slate-600">{transcript}</span>
        </p>
      ) : (
        // Previously the only clue that this mic expects a spoken *gap
        // number* — not the word itself read aloud with pauses, the more
        // intuitive reading of "divide the word into syllables" — was
        // idleLabel's aria-label on the button above, invisible to sighted
        // users. Saying the whole word matched no number/command pattern
        // and silently did nothing, which read as "the mic doesn't work."
        <p className="mb-1 shrink-0 text-center text-[10px] font-medium text-slate-600 sm:mb-2 sm:text-xs">
          {t('speakGapNumber')}
        </p>
      )}

      {}
      {!zenMode && (
        <div
          className="mb-2 shrink-0 text-4xl sm:mb-4 sm:text-6xl"
          aria-hidden="true"
        >
          {data.icon || '✂️'}
        </div>
      )}

      {}
      <div className="mb-1 flex h-6 w-full shrink-0 items-center justify-center sm:mb-2 sm:h-8">
        {activeHighlight !== null &&
          (() => {
            const syl = data.segments[activeHighlight];
            const phonetic = getTTSException(syl, language);
            if (phonetic && phonetic.toLowerCase() !== syl.toLowerCase()) {
              return (
                <span className="animate-in fade-in slide-in-from-bottom-2 rounded-full bg-slate-800 px-5 py-1.5 text-xs font-black tracking-widest text-white uppercase shadow-md">
                  / {phonetic} /
                </span>
              );
            }
            return null;
          })()}
      </div>

      {}
      <div className="no-scrollbar mb-2 flex max-h-full min-h-0 w-full max-w-full shrink flex-wrap items-center justify-center gap-y-1 overflow-y-auto sm:mb-4 sm:gap-y-4">
        {wordChars.map((char, index) => (
          <React.Fragment key={index}>
            <span
              className={`${charSize} inline-block font-black tracking-tighter transition-all duration-200 ${
                activeHighlight === charToSyl[index]
                  ? 'z-10 scale-110 text-yellow-500 drop-shadow-md'
                  : themeStyles.accent
              }`}
            >
              {char}
            </span>

            {index < wordChars.length - 1 && (
              <button
                onClick={() => toggleCut(index + 1)}
                className={`group relative ${cutHitbox} flex shrink-0 flex-col items-center justify-center transition-all`}
                disabled={isResolved || isListening}
                aria-label={
                  cuts.includes(index + 1)
                    ? t('removeCut', { position: index + 1 })
                    : t('addCut', { position: index + 1 })
                }
                aria-pressed={cuts.includes(index + 1)}
              >
                <div
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    cuts.includes(index + 1)
                      ? `h-14 ${themeStyles.button} shadow-lg md:shadow-sm`
                      : `h-4 bg-slate-100 ${isListening ? '' : 'group-hover:h-10 group-hover:bg-slate-200'}`
                  }`}
                />

                {cuts.includes(index + 1) && !isResolved && (
                  <span
                    className={`absolute -top-8 text-2xl ${bounceClass}`}
                    aria-hidden="true"
                  >
                    ✂️
                  </span>
                )}

                {/* In normal flow (not absolutely positioned) so it
                    contributes to this button's own height — and so, once a
                    long word wraps to multiple lines on a narrow screen,
                    correctly pushes wrapped lines apart instead of
                    overlapping the line below. */}
                {!isResolved && (
                  <span
                    className={`mt-1 shrink-0 text-[10px] leading-none font-black ${isHighContrast ? 'text-white/50' : 'text-slate-600'}`}
                  >
                    {index + 1}
                  </span>
                )}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {}
      <div className="mt-auto w-full max-w-xs shrink-0 space-y-2 px-4 pt-2 sm:space-y-3 sm:pt-4">
        <button
          onClick={checkAnswer}
          disabled={isResolved || cuts.length === 0 || isListening}
          className={`w-full ${btnPadding} rounded-3xl font-black tracking-widest uppercase shadow-xl transition-all ${
            cuts.length > 0 && !isResolved && !isListening
              ? `${themeStyles.button} ${themeStyles.buttonText} active:scale-95`
              : 'cursor-not-allowed bg-slate-100 text-slate-300'
          }`}
        >
          <BionicText text={t('check') || 'Check'} enabled={bionicReading} />
        </button>

        <button
          onClick={() => setCuts([])}
          disabled={isResolved || cuts.length === 0 || isListening}
          className={`w-full py-2 text-[10px] font-black tracking-widest uppercase transition-colors ${
            cuts.length > 0 && !isListening
              ? 'text-slate-600 hover:text-red-400'
              : 'text-transparent'
          }`}
        >
          <BionicText text={t('delete') || 'Delete'} enabled={bionicReading} />
        </button>
      </div>
    </div>
  );
}

export default React.memo(SyllableExercise);
