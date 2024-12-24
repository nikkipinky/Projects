import React, { useState, useEffect } from 'react';
import Card from './Card';
import axios from 'axios';

const Main = () => {
  const [search, setSearch] = useState('');
  const [bookData, setData] = useState([]);

  // Fetch books from MySQL
  useEffect(() => {
    axios.get('http://localhost:5000/api/books')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  // Add a new book to MySQL
  const addBook = (book) => {
    const { title, authors, saleInfo, volumeInfo } = book;
    const price = saleInfo?.listPrice?.amount || null;
    const thumbnail = volumeInfo.imageLinks?.smallThumbnail || '';
    const newBook = { title, author: authors?.join(', '), price, thumbnail };

    axios.post('http://localhost:5000/api/books', newBook)
      .then(() => console.log('Book added to database'))
      .catch(err => console.error(err));
  };

  const searchBook = (evt) => {
    if (evt.key === "Enter") {
      axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search}`)
        .then(res => {
          setData(res.data.items);
          res.data.items.forEach(addBook); // Add each book to the database
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <>
      <div className="header">
        <div className="row1">
          <h1>A room without books is like<br /> a body without a soul.</h1>
        </div>
        <div className="row2">
          <h2>Find Your Book</h2>
          <div className="search">
            <input type="text" placeholder="Enter Your Book Name"
              value={search} onChange={e => setSearch(e.target.value)}
              onKeyPress={searchBook} />
            <button><i className="fas fa-search"></i></button>
          </div>
        </div>
      </div>

      <div className="container">
        <Card book={bookData} />
      </div>
    </>
  );
};

export default Main;
