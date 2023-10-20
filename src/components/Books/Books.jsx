import React, { useEffect, useState } from 'react'
import "./Books.css"
import "./mediaBooks.css"
export const Books = () => {
    const [poster, setPoster] = useState({})
    const [books, setBooks] = useState([])
    const [items, setItems] = useState([])
    const [total, setTotal] = useState(0);
    const [estado, setEstado] = useState(true)
    const deleteC = (id) => {
        let book = [...books]
        let count = 0;
        let array = items.filter((book) => {
            if (book.id == id) {
                count = book.count;
                return false;
            }
            return true; // Esto mantendrá el libro en el array
        });

        book.forEach((i) => {
            if (i.id == id) {
                i.disponible = count;
            }
        })

        setBooks(book)
        setItems(array); // Actualiza el estado con la copia modificada del array
    }

    const less = (id) => {
        let book = books;
        book.forEach((i) => {
            if (i.id == id) {
                i.disponible += 1
            }
        })
        let array = items.filter((book) => {
            if (book.id == id) {
                book.count = book.count - 1;
                book.total = book.total - book.price;
                if (book.count <= 0) {
                    return false; // Esto eliminará el libro del array
                }
            }
            return true; // Esto mantendrá el libro en el array
        });

        setItems(array); // Actualiza el estado con la copia modificada del array
    }

    const addItem = (image, title, description, price, id, disponible) => {
        let array = [...items]; // Crea una copia del array items
        let book = [...books]
        let add = 0;
        const newItem = {
            id: id,
            image: image,
            title: title,
            description: description,
            price: price,
            count: 1,
            total: price,
            disponible: disponible
        };

        book.forEach((i) => {
            if (i.id == id) {
                if (i.disponible == 0) {
                    setEstado(false)
                } else {
                    i.disponible -= 1
                    setEstado(true)
                    array.forEach((book) => {
                        if (book.id == id) {
                            book.count = book.count + 1;
                            book.total = book.count * book.price;
                            add += 1;
                        }
                    });
                    if (add == 0) {
                        array.push(newItem); // Agrega el nuevo item a la copia del array
                    }
                }
            }
        })

        setBooks(book)
        setItems(array); // Actualiza el estado con la copia modificada del array
    };


    useEffect(() => {
        console.log(items);
        let total = 0;
        items.forEach(i => {
            total += i.total
        })

        setTotal(total)
    }, [items])

    useEffect(() => {
        const key = 'ebe8a7dd9de9ff2deeefda7565d16289'
        const fetchData = async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/collection/1241?api_key=${key}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                const min = 100000;
                const max = 300000;
                const cantidadMin = 0;
                const cantidadMax = 5;
                let randomCantidad = 0;
                let random = 0
                data.parts.map((item) => {
                    randomCantidad = Math.floor(Math.random() * (cantidadMax - cantidadMin + 1)) + cantidadMin;
                    random = Math.floor(Math.random() * (max - min + 1)) + min;
                    item.precio = random;
                    item.disponible = randomCantidad;
                })
                console.log(random);

                setPoster(data)
                setBooks(data.parts)
                console.log(data);;
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log(poster);
    }, [poster])


    useEffect(() => {
        console.log("books", books);
    }, [books])

    return (
        <>
            <nav>
                <img src="https://image.tmdb.org/t/p/original/xN6SBJVG8jqqKQrgxthn3J2m49S.jpg" alt="Image post collection" />
                <div className='descriptionCollection'>
                    <h2>{poster.name}</h2>
                    <h3>Vista general</h3>
                    <p>The story starts with the celebration of the magic world. For many years, he had been terrorized by the evil wizard Lord Voldemort. The night before, October 31, Voldemort discovered the Potter family's hidden hideout and killed Lily and James Potter. However, when he attempts to kill his 1-year-old son, Harry, the Avada Kedavra killing curse turns on himself. Voldemort's body is destroyed, but his spirit survives: he is neither dead nor alive. For his part, Harry only has a lightning-shaped scar on his forehead that is the only physical remnant of Voldemort's curse. Harry is the only survivor of the Killing Curse, and in the wake of Voldemort's mysterious defeat, the wizarding world begins to call him "the boy who lived."</p>
                </div>
            </nav>
            <main>
                <div className='carritoCompras'>
                    <div className='title'>
                        <h3>Carrito de compras</h3>
                    </div>
                    <div className='compras'>
                        {items.map((item) => (
                            <div className='date' key={item.id}>
                                <img src={`https://image.tmdb.org/t/p/original${item.image
                                    }`} alt="Harry potter libros" />
                                <div className='titlePriceDelete'>
                                    <p>{item.title}</p>
                                    <p>Precio unitario: <b>{item.price}</b></p>
                                    <p>Total compra: {item.total}</p>
                                    <button onClick={() => { deleteC(item.id) }} className='delete'>Delete</button>
                                </div>


                                {estado == true ? (
                                    // Aquí es donde pones lo que quieres renderizar si items.length es 0
                                    <div className='buttons'>
                                        <button onClick={() => { addItem(item.image, item.title, item.title, item.price, item.id) }}>+</button>
                                        <p>{item.count}</p>
                                        <button onClick={() => { less(item.id) }}>-</button>
                                    </div>
                                ) : (
                                    // Y aquí es donde pones lo que quieres renderizar si items.length no es 0
                                    <div className='buttons'>
                                        <p>Agotado</p>
                                        <p>{item.count}</p>
                                        <button onClick={() => { less(item.id) }}>-</button>
                                    </div>

                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className='total'>
                    <p>Total: <b>{total}</b></p>
                </div>
                <div className='CancelarCompra'>
                    <button>Cancelar Compra</button>
                    <button>Comprar</button>
                </div>
                <div className='books'>
                    {books.map((item) => (
                        <div className='item' key={item.id}>
                            <img src={`https://image.tmdb.org/t/p/original${item.poster_path
                                }`} alt="Harry potter libros" />
                            <div className='imgTitle'>
                                <h4>{item.title}</h4>
                                <p>{item.overview}</p>
                                <p>Precio: <b>{item.precio}</b></p>
                                <p>Dispoible: {item.disponible}</p>
                                {item.disponible > 0 ? (
                                    // Aquí es donde pones lo que quieres renderizar si items.length es 0
                                    <button onClick={() => { addItem(item.poster_path, item.title, item.overview, item.precio, item.id, item.disponible) }}>Add to car</button>
                                ) : (
                                    // Y aquí es donde pones lo que quieres renderizar si items.length no es 0
                                    <p>Agotado</p>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    )
}
