import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { LaunchButton } from "@/components/LaunchButton";

const DESTINATION_URL = "https://centurion-es.org/auth/login";
const DEFAULT_BACKDROP = "/assets/images/Centurion%20Banner%20Design.jpg";

const Index = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(DEFAULT_BACKDROP);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showLaunch, setShowLaunch] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isCountingDown) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowLaunch(true);
      setTimeout(() => {
        window.open(DESTINATION_URL, "_blank");
        resetCountdown();
      }, 1000);
    }
  }, [isCountingDown, countdown]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setBackgroundImage(DEFAULT_BACKDROP);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startCountdown = () => {
    setIsCountingDown(true);
    setCountdown(5);
    setShowLaunch(false);
  };

  const resetCountdown = () => {
    setIsCountingDown(false);
    setCountdown(5);
    setShowLaunch(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background Image */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${backgroundImage}")` }}
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Image Upload Controls */}
        {!isCountingDown && (
          <div className="absolute top-6 right-6 flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <Upload className="mr-2 h-4 w-4" />
              {backgroundImage ? "Change Image" : "Upload Backdrop"}
            </Button>
            {backgroundImage && (
              <Button
                variant="outline"
                size="sm"
                onClick={removeImage}
                className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="text-center flex flex-col items-center gap-12">
          {!isCountingDown && (
            <h1 className="text-5xl font-black uppercase tracking-wider text-white md:text-7xl">
              Ready for Launch
            </h1>
          )}

          {isCountingDown && (
            <div className="h-48 flex items-center justify-center">
              {!showLaunch ? (
                <div
                  key={countdown}
                  className="animate-countdown text-[10rem] font-black leading-none text-white md:text-[12rem]"
                  style={{
                    textShadow:
                      "0 0 40px rgba(255,255,255,0.4), 0 0 80px rgba(255,255,255,0.2)",
                  }}
                >
                  {countdown}
                </div>
              ) : (
                <div
                  className="animate-launch text-5xl font-black uppercase tracking-widest text-white md:text-7xl"
                  style={{
                    textShadow:
                      "0 0 40px rgba(255,255,255,0.4), 0 0 80px rgba(255,255,255,0.2)",
                  }}
                >
                  LAUNCH!
                </div>
              )}
            </div>
          )}

          {/* 🔱 CENTURION THEMED BUTTON */}
          <div className={`${isCountingDown ? "scale-90 transition-transform duration-500" : ""}`}>
            <LaunchButton onClick={startCountdown} isLocked={isCountingDown} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
