import { createContext, useState } from "react";
import runChat from "../Config/Gemini";

export const Context = createContext();




const ContextProvider = (props)=> {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayParam = (index,nextWord)=> {
        setTimeout(() => {
            setResultData(prev=>prev+nextWord);
        }, 75*index);
    }

    const newChat = ()=> {
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async(prompt)=> {
        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if(prompt !== undefined) {
            response = await runChat(prompt)
            setRecentPrompt(prompt)
        }
        else {
            setPrevPrompts(prev=>[...prev,prompt])
            setRecentPrompt(input)
            response = await runChat(input)
        }
        let responseArray = response.split("**");
        let newResponse = "";

        for(let i=0; i < responseArray.length; i++) {
            if(i===0 || i%2 !== 1) {
                newResponse += responseArray[i];
            }
            else {
                newResponse += "<b>" + responseArray[i] + "</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("<br>");
        let newResponseArray = newResponse2.split(" ");
        for(let i=0; i< newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayParam(i,nextWord+" ");
        }
        setLoading(false);
        setInput("")

    }

    const ContextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={ContextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider