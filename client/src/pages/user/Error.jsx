import React from "react";
import { FaSuperpowers } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Alert from "../../components/ui/alert";

const Error = () => {
  return (
    <div className="min-h-130 bg-gray-100 flex justify-center items-center px-4">
      <Card className="max-w-xl w-full">
        <CardHeader className="text-center">
          <FaSuperpowers className="text-6xl text-slate-800 animate-spin mx-auto" />
          <CardTitle className="text-4xl text-red-600">Error 404</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            Oh no! This page cannot be found. Please check the URL and try again.
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default Error;
