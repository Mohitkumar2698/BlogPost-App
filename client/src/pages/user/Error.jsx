import React from "react";
import { FaCompass } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Alert from "../../components/ui/alert";
import Button from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-slate-50 via-white to-cyan-50 flex justify-center items-center px-4">
      <Card className="max-w-xl w-full border-slate-200 shadow-sm">
        <CardHeader className="text-center">
          <FaCompass className="text-6xl text-slate-800 mx-auto" />
          <CardTitle className="text-4xl text-slate-900">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            Oh no! This page cannot be found. Please check the URL and try again.
          </Alert>
          <Button className="mt-4 w-full" onClick={() => navigate("/")}>
            Back To Explore
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Error;
