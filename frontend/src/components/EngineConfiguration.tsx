import { Select, SelectItem } from "@nextui-org/select";
import { Tab, Tabs } from "@nextui-org/tabs";
import { useState } from "react";
import { EngineDetails } from "../utils/config";

const EngineConfiguration = ({ selectedEngine, setSelectedEngine }: any) => {
    return (
        <Select
            label="Select Engine"
            className="max-w-[20rem] w-full m-4"
            classNames={{
                listbox: "bg-[#3C3B39] text-white",
                popoverContent: "bg-[#3C3B39]",
                // mainWrapper: "bg-[#3C3B39]",
                // base: "bg-[#3C3B39]",[#3C3B39]
                trigger: "bg-[#3C3B39]",
                // innerWrapper: "bg-[#3C3B39]",
            }}
            selectedKeys={[selectedEngine]}
            onSelectionChange={(e) => {
                e.anchorKey && setSelectedEngine(e.anchorKey);
            }}
        >
            {EngineDetails.map((detail) => (
                <SelectItem key={detail.key}>{detail.label}</SelectItem>
            ))}
        </Select>
    )
}


const EngineInfo = () => {
    const [selectedKey, setSelectedKey] = useState("engine");
    const [selectedEngine, setSelectedEngine] = useState("stockfish-16.1")
    return (
        <div className="w-[35%] md:w-11/12 lg:w-11/12 md:min-h-[30rem] lg:min-h-[30rem] h-full flex flex-col bg-[#262522] m-0 p-0 rounded-[1.6%] pb-2">
            <Tabs
                aria-label="Options"
                fullWidth={true}
                color="primary"
                selectedKey={selectedKey}
                onSelectionChange={(key) => {
                    setSelectedKey(key.toString());
                }}
                classNames={{
                    tabList: "bg-[#21201D]",
                    tab: "h-10",
                    panel: "h-full rounded-[1.6%] flex-grow",
                    cursor: "w-full bg-[#262522]",
                    // base: "bg-red-400",
                    tabContent: "text-8 text-white",
                }}
            >
                <Tab key={"engine"} title={"Engine"}>
                    <EngineConfiguration selectedEngine={selectedEngine} setSelectedEngine={setSelectedEngine} />
                </Tab>
                <Tab key={"history"} title={"History"}>

                </Tab>
            </Tabs>
        </div>
    )
}

export default EngineInfo;