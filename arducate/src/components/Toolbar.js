import React, { useState } from "react";
import { useAtom } from "jotai";
import { arObjectsAtom, transformModeAtom } from "../atoms";
import { convertSceneToAR } from "./Conversion/ARPublish";
import { convertSceneToVR } from "./Conversion/VRPublish";
import { Button } from "../@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../@/components/ui/select";
import { Move, MoveDiagonal, RotateCw } from "lucide-react";
import AssetHandler from "./AssetHandler";
import { treeDataAtom } from "../atoms";
import { supabase } from './supabaseClient'; // Adjust the import path as necessary
import { v4 as uuidv4 } from 'uuid'; // Install uuid package for unique IDs

const Toolbar = () => {
  const [arObjects] = useAtom(arObjectsAtom);
  const [data, setData] = useAtom(treeDataAtom);
  const [cursor, setCursor] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [generatedUrl, setGeneratedUrl] = useState(sessionStorage.getItem('ar_content_url') || null); // Check sessionStorage for the URL
  const [popupMessage, setPopupMessage] = useState(''); // State to hold the popup message

  const handlePreview = () => {
    const htmlContent = convertSceneToVR(arObjects);
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  // Handle the publishing action
  const handlePublish = async () => {
    if (!generatedUrl) { // Only generate a new URL if one doesn't exist
      const htmlContent = convertSceneToAR(arObjects);
      const uniqueId = uuidv4(); // Generate a unique ID for the content

      try {
        const { data, error } = await supabase
          .from('ar_content')
          .insert([
            { url: uniqueId, html_content: htmlContent }
          ]);
  
        if (error) {
          throw new Error('Failed to save content: ' + error.message);
        }

        const baseUrl = window.location.origin; 
        const arContentUrl = `${baseUrl}/ar-content/${uniqueId}`;        
        setGeneratedUrl(arContentUrl); // Store the URL
        sessionStorage.setItem('ar_content_url', arContentUrl); // Persist in sessionStorage
        window.open(arContentUrl, '_blank'); // Open the generated URL
      } catch (err) {
        console.error(err.message);
      }
    } else {
      // If the URL already exists, just open it
      window.open(generatedUrl, '_blank');
    }
  };

  // Handle the sharing action
  const handleShare = async () => {
    if (!generatedUrl) { // Only generate a new URL if one doesn't exist
      const htmlContent = convertSceneToAR(arObjects); // Get the HTML content for the AR scene
      const uniqueId = uuidv4(); // Generate a unique ID for the content
      
      try {
        const { data, error } = await supabase
          .from('ar_content')
          .insert([
            { url: uniqueId, html_content: htmlContent }
          ]);

        if (error) {
          throw new Error('Failed to save content: ' + error.message);
        }

        const baseUrl = window.location.origin; 
        const arContentUrl = `${baseUrl}/ar-content/${uniqueId}`;
        setGeneratedUrl(arContentUrl); // Store the URL
        sessionStorage.setItem('ar_content_url', arContentUrl); // Persist in sessionStorage

        // Copy the full URL to clipboard
        navigator.clipboard.writeText(arContentUrl).then(() => {
          setPopupMessage(
            <span>
              <strong>Link copied to clipboard:</strong> {arContentUrl}
            </span>
          ); // Set the popup message with the URL in regular font
          setShowPopup(true); // Show the popup to indicate success
        }).catch((err) => {
          console.error("Error copying text to clipboard: ", err);
        });
  
      } catch (err) {
        console.error(err.message); // Log any errors
      }
    } else {
      // If the URL already exists, just copy it
      navigator.clipboard.writeText(generatedUrl).then(() => {
        setPopupMessage(
          <span>
            <strong>Link copied to clipboard:</strong> {generatedUrl}
          </span>
        ); // Set the popup message with the URL in regular font
        setShowPopup(true); // Show the popup to indicate success
      }).catch((err) => {
        console.error("Error copying text to clipboard: ", err);
      });
    }
  };

  // Function to close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <nav className="w-full bg-primary p-2 flex justify-between items-center">
      {/* Left Aligned Buttons */}
      <div className="navbar-button-container">
        <AssetHandler
          data={data}
          setData={setData}
          cursor={cursor}
          setCursor={setCursor}
        />
      </div>

      {/* Center Aligned */}
      <div className="flex-grow text-center">
        <h2 className="scroll-m-20 text-1xl font-semibold text-white">
          ARducate
        </h2>
      </div>

      {/* Right Aligned */}
      <div className="navbar-button-container">
        <Button
          variant="outline"
          onClick={handlePreview}
          className="navbar-button"
        >
          Preview
        </Button>

        <Button
          variant="outline"
          className="navbar-button"
          onClick={handlePublish}
        >
          Publish
        </Button>

        {/* Share Button */}
        <Button
          variant="outline"
          className="navbar-button"
          onClick={handleShare}
        >
          Share
        </Button>

        {/* Popup Notification */}
        {showPopup && (
          <>
            <div className="fixed inset-0 bg-black opacity-50 z-40" /> {/* Backdrop overlay */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-gray-800 text-white p-4 rounded shadow-lg border border-gray-600">
                <span>
                  {popupMessage}
                </span>
                <button 
                  onClick={closePopup} 
                  className="ml-2 text-white bg-red-500 hover:bg-red-600 rounded px-2 py-1 transition duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Toolbar;