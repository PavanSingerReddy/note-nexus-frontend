import Navbar from './Navbar';
import Notes from './Notes';
import SearchBar from './SearchBar';
import AddNoteButton from './buttons/AddNoteButton';

const HomePage = () => {
  return (
    <>
      <div className="sticky top-0 z-50">
        <Navbar />
        <SearchBar />
      </div>
      <Notes />
      <AddNoteButton />
    </>
  )
}

export default HomePage