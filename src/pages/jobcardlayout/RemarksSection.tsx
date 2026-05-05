const RemarksSection = ({ isUrdu }: any) => {
  return (
    <div className="flex border mt-2 text-[11px]">
      <div className="w-[80%] p-2 border-r leading-5">
        <b>REMARKS:</b><br />
        NC = NO CREW | NF = NO FEED | MB = MECHANICAL B/D
      </div>

      <div className="w-[20%] text-center flex flex-col justify-end pb-2">
        <div className="border-t mx-2">
          Department Head
        </div>
      </div>
    </div>
  );
};

export default RemarksSection;