import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditModal from "./EditModal";

const TranscriptEditor = ({ initialTranscript }) => {
  const [transcript, setTranscript] = useState(initialTranscript);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wordToChange, setWordToChange] = useState("");
  const [newWord, setNewWord] = useState("");
  const [showModal, setShowModal] = useState(false);
  const timerRef = useRef(null);

  const startPlayback = () => {
    setIsPlaying(true);
    setCurrentTime(0);
    timerRef.current = setInterval(() => {
      setCurrentTime((prevTime) => {
        const endTime = getTranscriptEndTime();
        if (prevTime >= endTime) {
          clearInterval(timerRef.current);
          setIsPlaying(false);
          return endTime;
        }
        return prevTime + 10;
      });
    }, 10);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    clearInterval(timerRef.current);
  };

  const getTranscriptEndTime = () => {
    const lastItem = transcript[transcript.length - 1];
    return lastItem.start_time + lastItem.duration;
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const getHighlightedWord = () => {
    return transcript.find(
      (item) =>
        currentTime >= item.start_time &&
        currentTime < item.start_time + item.duration
    );
  };

  const highlightedWord = getHighlightedWord();

  const openEditModal = (word) => {
    setWordToChange(word);
    setShowModal(true);
  };

  const handleChange = () => {
    const hasAlphabet = /[a-zA-Z]/.test(newWord);
    if (!hasAlphabet) {
      toast.error("Please enter a valid word.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }
    const updatedTranscript = transcript.map((entry) =>
      entry.word === wordToChange ? { ...entry, word: newWord } : entry
    );

    setTranscript(updatedTranscript);
    setShowModal(false);
    setNewWord("");
    setWordToChange("");
    toast.success("Word updated successfully!", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />

      <div className="relative h-screen">
        {/* Edit Modal */}
        {showModal ? (
          <>
        <EditModal handleChange={handleChange} setShowModal={setShowModal} wordToChange={wordToChange} setNewWord={setNewWord}/>
          </>
        ) : null}

        <h1 className="absolute top-0 left-0 w-full text-center p-4 text-5xl font-extrabold text-gray-900">
          <span className="font-mono text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            Transcript
          </span>{" "}
          Editor
        </h1>

        <div className="flex flex-col justify-center items-center h-full">
          <div className="max-w-5xl max-h-96 overflow-y-auto">
            {transcript.map((item, index) => (
              <span
                key={index}
                style={{
                  backgroundColor:
                    highlightedWord === item ? "yellow" : "transparent",
                  fontWeight: highlightedWord === item ? "bold" : "",
                }}
                className="inline-block font-mono rounded-md text-2xl font-thin px-4 py-2 mx-1 hover:cursor-pointer hover:text-gray-500"
                onClick={() => openEditModal(item.word)}
              >
                {item.word}
              </span>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 w-full text-center p-4 text-3xl font-extrabold text-gray-900">
            {isPlaying ? (
              <button
                onClick={stopPlayback}
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white"
              >
                <span className="font-sans text-xl relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                  Stop Playback
                </span>
              </button>
            ) : (
              <button
                onClick={startPlayback}
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white"
              >
                <span className="font-sans text-xl relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                  Start Playback
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TranscriptEditor;
