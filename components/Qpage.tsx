export default function Qpage({ name }: any, { verse: [] }) {
  return (
    <div>
      <div className="flex flex-col leading-loose items-center text-center w-[60vw] text-2xl tracking-wider font-Scheherazade_New font-bold">
        <h1>سورة {name}</h1>
        <p>
          {/* {verse.verses.map((verse: any) => (
            <>
              {verse.text_uthmani}{" "}
              <span className="bg-gray-200 p-1">{verse.verse_key}</span>{" "}
            </>
          ))} */}
        </p>
      </div>
    </div>
  );
}
