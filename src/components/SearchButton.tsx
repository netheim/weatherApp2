import {FC} from "react";

type SearchButtonType = {
    children: string,
    onClick: () => void,
}

const SearchButton:FC<SearchButtonType> = ({children, onClick}) => {
    return (
        <button onClick={onClick} className="text-xl cursor-pointer bg-black/40 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-black/70 transition duration-300 ease-in-out">
            {children}
        </button>
    );
};

export default SearchButton;