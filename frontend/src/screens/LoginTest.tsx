import { useState } from "react";
// import { Button, Input, Tabs, Tab, Card, CardBody } from '@nextui-org/react'
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Card, CardBody } from "@nextui-org/card";
import { Mail, Lock, User, Github } from "lucide-react";

export default function LoginSignuptest() {
  const [selected, setSelected] = useState("login");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 text-white">
        <CardBody className="overflow-hidden">
          <Tabs
            selectedKey={selected}
            onSelectionChange={setSelected as any}
            color="primary"
            variant="underlined"
            classNames={{
              tabList:
                "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-primary",
            }}
          >
            <Tab key="login" title="Login">
              <form className="flex flex-col gap-4 h-[300px] py-4">
                <Input
                  endContent={
                    <Mail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Email"
                  placeholder="Enter your email"
                  variant="bordered"
                />
                <Input
                  endContent={
                    <Lock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                />
                <div className="flex justify-between items-center">
                  <Button color="primary" variant="flat">
                    Sign In
                  </Button>
                  <Button
                    color="primary"
                    variant="light"
                    endContent={<Github className="text-xl" />}
                  >
                    Sign In with Github
                  </Button>
                </div>
              </form>
            </Tab>
            <Tab key="sign-up" title="Sign Up">
              <form className="flex flex-col gap-4 h-[300px] py-4">
                <Input
                  endContent={
                    <User className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Name"
                  placeholder="Enter your name"
                  variant="bordered"
                />
                <Input
                  endContent={
                    <Mail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Email"
                  placeholder="Enter your email"
                  variant="bordered"
                />
                <Input
                  endContent={
                    <Lock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                />
                <div className="flex justify-between items-center">
                  <Button color="primary" variant="flat">
                    Sign Up
                  </Button>
                  <Button
                    color="primary"
                    variant="light"
                    endContent={<Github className="text-xl" />}
                  >
                    Sign Up with Github
                  </Button>
                </div>
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
