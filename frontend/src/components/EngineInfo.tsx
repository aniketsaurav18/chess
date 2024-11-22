import { Select, SelectItem } from "@nextui-org/select";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Slider } from "@nextui-org/slider";
import { useEffect, useState } from "react";
import { EngineDetails } from "../utils/config";
import { Button } from "@nextui-org/button";
import { Progress } from "@nextui-org/progress";
import MoveHistory from "./MoveHistory";
import { DEFAULT_ENGINE_CONFIG } from "../utils/config";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { changeConfiguration } from "../store/slices/engine";
// import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";

const PlayAsButton = ({ setSide }: any) => {
  const [selected, setSelected] = useState("white");

  const handleSelect = (color: string) => {
    setSelected(color);
    setSide(color);
  };

  return (
    <div className="flex flex-row gap-4 items-center justify-center">
      Play as:
      <button
        onClick={() => handleSelect("white")}
        className={`m-2 text-base font-normal px-2 py-1 rounded ${
          selected === "white"
            ? "bg-[#2ea44f] border-2 border-[#22863a] text-white"
            : "bg-[#383636] hover:bg-[#2ea44f] hover:text-white"
        }`}
      >
        White
      </button>
      <button
        onClick={() => handleSelect("black")}
        className={`m-2 text-base font-normal px-2 py-1 rounded ${
          selected === "black"
            ? "bg-[#2ea44f] border-2 border-[#22863a] text-white"
            : "bg-[#383636] hover:bg-[#2ea44f] hover:text-white"
        }`}
      >
        Black
      </button>
    </div>
  );
};

const SliderComponent = ({
  label,
  minVal,
  maxVal,
  defaultVal,
  setvalue,
}: any) => {
  return (
    <Slider
      size="sm"
      step={1}
      color="foreground"
      label={label}
      showTooltip={true}
      maxValue={maxVal}
      minValue={minVal}
      defaultValue={defaultVal}
      className="w-2/3"
      classNames={{
        // mark:"bg-red-500",
        track: "bg-zinc-400",
        // step: "bg-blue-500"
        thumb: "bg-zinc-400 z-10",
      }}
      onChange={(value) => {
        setvalue(value);
      }}
    />
  );
};
const SelectComponent = ({ label, options, selected, setSelected }: any) => {
  return (
    <Select
      label={label}
      className="max-w-[20rem] w-full m-4"
      classNames={{
        listbox: "bg-[#3C3B39] text-white",
        popoverContent: "bg-[#3C3B39]",
        // mainWrapper: "bg-[#3C3B39]",
        // base: "bg-[#3C3B39]",[#3C3B39]
        trigger: "bg-[#3C3B39]",
        // innerWrapper: "bg-[#3C3B39]",
      }}
      selectedKeys={[selected]}
      onSelectionChange={(e) => {
        e.anchorKey && setSelected(e.anchorKey);
      }}
    >
      {options.map((option: any) => (
        <SelectItem key={option.key}>{option.label}</SelectItem>
      ))}
    </Select>
  );
};

const EngineInfo = ({
  initializeWorker,
  downloadProgress,
  setEngineConfiguration,
  setSide,
  gameHistory,
  engineStatus,
}: any) => {
  const dispatch = useAppDispatch();
  const [selectedTab, setSelectedTab] = useState("engine");
  const [selectedEngine, setSelectedEngine] = useState(
    DEFAULT_ENGINE_CONFIG.key
  );
  const [isMultithreaded, setIsMultithreaded] = useState(false);
  const [threads, setThreads] = useState(1);
  const [depth, setDepth] = useState(20);
  const [searchTime, setSearchTime] = useState(5);
  const [useDepth, setUseDepth] = useState(true);
  const [useTime, setUseTime] = useState(false);

  useEffect(() => {
    const engine = EngineDetails.find(
      (engine) => engine.key === selectedEngine
    );
    if (engine) {
      setIsMultithreaded(engine.multiThreaded);
    }
  }, [selectedEngine]);

  const handleApply = () => {
    let t = searchTime * 1000;
    setEngineConfiguration({
      elo: 0,
      multipv: 1,
      threads: threads,
      depth: useDepth ? depth : null,
      time: useTime ? t : null,
    });
    dispatch(
      changeConfiguration({
        key: selectedEngine,
        label:
          EngineDetails.find((engine) => engine.key === selectedEngine)
            ?.label || "Engine",
        threads: threads,
        depth: useDepth ? depth : 20,
        time: useTime ? t : 8000,
        multipv: 1,
        elo: 0,
      })
    );
    initializeWorker(selectedEngine, {
      threads: threads,
      depth: useDepth ? depth : null,
      time: useTime ? t : null,
      multipv: 1,
    });
  };

  return (
    <div className="w-[35%] md:w-11/12 lg:w-11/12 md:min-h-[30rem] lg:min-h-[30rem] h-full flex flex-col bg-[#262522] m-0 p-0 rounded-[1.6%] pb-2">
      <Tabs
        aria-label="Options"
        fullWidth={true}
        color="primary"
        selectedKey={selectedTab}
        key="engine"
        title="Engine"
        onSelectionChange={(key) => setSelectedTab(key.toString())}
        classNames={{
          tabList: "bg-[#21201D]",
          tab: "h-10",
          panel: "h-full rounded-[1.6%] flex-grow",
          cursor: "w-full bg-[#262522]",
          tabContent: "text-8 text-white",
        }}
      >
        <Tab key={"engine"} title={"Engine"}>
          <div className="flex flex-col justify-center items-center gap-2">
            <SelectComponent
              label="Select Engine"
              options={EngineDetails}
              selected={selectedEngine}
              setSelected={setSelectedEngine}
            />
            {downloadProgress.currentlyDownloading !== "" && (
              <Progress
                size="sm"
                label={`Downloading ${downloadProgress.currentlyDownloading}`}
                value={downloadProgress.progress}
                className="w-full max-w-[20rem]"
              />
            )}
            <div className="flex flex-row gap-2 items-center justify-between">
              <p>Use: </p>
              <input
                id="useDepth"
                type="checkbox"
                className="accent-green-600"
                checked={useDepth}
                disabled={!useTime}
                onChange={() => {
                  if (!useTime) return; // Prevent unchecking if the other checkbox is unchecked
                  setUseDepth(!useDepth);
                }}
              />
              <label htmlFor="useDepth">Depth</label>

              <input
                id="useTime"
                type="checkbox"
                className="accent-green-600"
                checked={useTime}
                disabled={!useDepth}
                onChange={() => {
                  if (!useDepth) return; // Prevent unchecking if the other checkbox is unchecked
                  setUseTime(!useTime);
                }}
              />
              <label htmlFor="useTime">Search Time</label>
            </div>
            {useDepth && (
              <SliderComponent
                label="Depth"
                minVal={12}
                maxVal={30}
                defaultVal={20}
                setvalue={setDepth}
              />
            )}
            {useTime && (
              <SliderComponent
                label="Search Time(sec)"
                minVal={1}
                maxVal={30}
                defaultVal={5}
                setvalue={setSearchTime}
              />
            )}
            {isMultithreaded && (
              <SliderComponent
                label="Threads"
                minVal={1}
                maxVal={8}
                defaultVal={1}
                setvalue={setThreads}
              />
            )}
            <PlayAsButton setSide={setSide} />
            <Button
              size="md"
              className="max-w-[20rem] w-full bg-[#2ea44f] hover:bg-[#2c974b] text-lg font-medium"
              onClick={handleApply}
            >
              Apply
            </Button>
            <div>{engineStatus ? "Engine Ready" : "Engine Not Ready"}</div>
          </div>
        </Tab>
        <Tab key={"history"} title={"History"}>
          <MoveHistory gameHistory={gameHistory} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default EngineInfo;
