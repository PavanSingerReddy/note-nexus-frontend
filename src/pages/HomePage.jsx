import Navbar from './Navbar';
import Notes from './Notes';
import AddNoteButton from './AddNoteButton';
import SearchBar from './SearchBar';

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