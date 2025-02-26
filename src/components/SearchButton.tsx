import {FC} from "react";

type SearchButtonType = {
    children: string,
    onClick: () => void,
}

const SearchButton:FC<SearchButtonType> = ({children, onClick}) => {
    return (
        <button onClick={onClick} className="text-xl cursor-pointer bg-black/40 text-white font-bold py-2 px-4 rounded-lg
        shadow-lg hover:bg-black/70 transition duration-300 ease-in-out max-[1362px]:text-[16px] max-[853px]:text-[12px] max-[666px]:text-[9px] max-[535px]:text-[7px]" >
            {children}
        </button>
    );
};

export default SearchButton;