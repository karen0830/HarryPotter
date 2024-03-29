import React, { useEffect, useState} from "react";
import "./Books.css";
import "./mediaBooks.css"

export const Books = () => {
    const [poster, setPoster] = useState({}); //Titulo e imagen
    const [books, setBooks] = useState([]);//libros 
    const [items, setItems] = useState([]);//libros agregados al carrito de compras
    const [total, setTotal] = useState(0);//total
    const [classNameExitBuy, setClassNameExitBuy] = useState(false);//Estado de la compra si es true pasa classNameBuy a false que permite esconder el boton principal de la compra
    const [totalExitBuy, setTotalExitBuy] = useState(0) //mensaje en caso de darle yes a la compra
    const [classNameBuy, setClassNameBuy] = useState(false);// permite esconder el buton principal de la compra
    const [classNameCancel, setClassNameCancel] = useState(false);// permite esconder el buton principal de la cancelación
    const [classTextCancel, setClassTextCancel] = useState(false);//muestra el mensaje de la cancelacion
    const [stateTextCancel, setStateTextCancel] = useState(false);//Estado de la cancelacion si es true pasa calssTextCancel a false que permite esconder el boton principal de la cancelacion
    const [classShopping, setClassShoping] = useState(false)//Permite la apertura de el carrito de compras

    const yesBuy = () => {
        if (items.length == 0) {
            setClassNameExitBuy(true)
            setTotalExitBuy("Your Purchase was not completed because you have not added anything")
        } else {
            setClassNameExitBuy(true)
            setTotalExitBuy(`Your purchase has been successful with a total of ${total}`)
            setItems([])
        }

        setClassNameBuy(false)
    }

    const optionBooks = () => {
        if (classNameBuy == false && classNameExitBuy == true) {
            setClassNameBuy(false);
        } else {
            setClassNameBuy(true)
        };
        setClassNameExitBuy(false)
    };

    const yesCancel = () => {
        let book = [...books];
        let array = items;

        if (items.length == 0) {
            setStateTextCancel(true)
            setClassTextCancel("Nothing was canceled because nothing was added")
        } else {
            setStateTextCancel(true)
            setClassTextCancel(`Your cancellation has been successful`)
            array.forEach((j) => {
                book.forEach((i) => {
                    if (j.id == i.id) {
                        i.disponible += j.count
                    }
                });
            })
        }

        setClassNameCancel(false)

        setBooks(book);
        setItems([])
    };

    const cancelPurchase = () => {
        console.log(classNameCancel);
        if (classNameCancel == true) {
            setClassNameCancel(false)
        } else {
            setClassNameCancel(true)
        };
    };

    const deleteC = (id) => {
        let book = [...books];
        let count = 0;
        let array = items.filter((book) => {
            if (book.id == id) {
                count = book.count;
                return false;
            }
            return true; 
        });

        book.forEach((i) => {
            if (i.id == id) {
                i.disponible = i.disponible + count;
                console.log(i.disponible);
            }
        });

        setBooks(book);
        setItems(array); 
    };

    const less = (id) => {
        let book = books;
        let array = 0;
        book.forEach((i) => {
            if (i.id == id) {
                i.disponible += 1;
                if (i.disponible > 0) {
                    array = items.filter((book) => {
                        if (book.id == id) {
                            book.count = book.count - 1;
                            book.total = book.total - book.price;
                            book.estado = true
                            if (book.count <= 0) {
                                return false; 
                            }
                        }
                        return true; 
                    });
                }
            }
        });

        setBooks(book);
        setItems(array); 
    };

    const addItem = (image, title, description, price, id, disponible) => {
        let array = [...items]; 
        let book = [...books];
        let add = 0;
        const newItem = {
            id: id,
            image: image,
            title: title,
            description: description,
            price: price,
            count: 1,
            total: price,
            disponible: disponible,
            estado: true
        };

        book.forEach((i) => {
            if (i.id == id) {
                if (i.disponible == 0) {
                    array.forEach((book) => {
                        if (book.id == id) {
                            book.estado = false
                        }
                    });
                } else {
                    i.disponible -= 1;
                    array.forEach((book) => {
                        if (book.id == id) {
                            book.count = book.count + 1;
                            book.total = book.count * book.price;
                            add += 1;
                            book.estado = true
                        }
                    });
                    if (add == 0) {
                        array.push(newItem);
                    }
                }
            }
        });

        setBooks(book);
        setItems(array);
    };

    useEffect(() => {
        console.log(items);
        let total = 0;
        items.forEach((i) => {
            total += i.total;
        });

        setTotal(total);
    }, [items]);

    useEffect(() => {
        const key = "ebe8a7dd9de9ff2deeefda7565d16289";
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/collection/1241?api_key=${key}`
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                const min = 100000;
                const max = 300000;
                const cantidadMin = 0;
                const cantidadMax = 15;
                let randomCantidad = 0;
                let random = 0;
                data.parts.map((item) => {
                    randomCantidad =
                        Math.floor(Math.random() * (cantidadMax - cantidadMin + 1)) +
                        cantidadMin;
                    random = Math.floor(Math.random() * (max - min + 1)) + min;
                    let randomNumber = Math.round(random / 1000) * 1000;
                    item.precio = randomNumber;
                    item.disponible = randomCantidad;
                });
                console.log(random);

                setPoster(data);
                setBooks(data.parts);
                console.log(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log(poster);
    }, [poster]);

    useEffect(() => {
        console.log("books", books);
    }, [books]);

    const cerrar = () => {
        setClassNameBuy(false);
        setClassNameExitBuy(false)
    }
    const cerrarCancel = () => {
        setClassNameCancel(false);
        setStateTextCancel(false)
    }

    const shopping = () => {
        if (classShopping) {
            setClassShoping(false)
        } else setClassShoping(true)
    }
    return (
        <>
            <nav>
                <img
                    src="https://image.tmdb.org/t/p/original/xN6SBJVG8jqqKQrgxthn3J2m49S.jpg"
                    alt="Image post collection"
                />
                <div className="descriptionCollection">
                    <h2>{poster.name}</h2>
                    <h3>Vista general</h3>
                    <p>
                        The story starts with the celebration of the magic world. For many
                        years, he had been terrorized by the evil wizard Lord Voldemort. The
                        night before, October 31, Voldemort discovered the Potter family's
                        hidden hideout and killed Lily and James Potter. However, when he
                        attempts to kill his 1-year-old son, Harry, the Avada Kedavra
                        killing curse turns on himself. Voldemort's body is destroyed, but
                        his spirit survives: he is neither dead nor alive. For his part,
                        Harry only has a lightning-shaped scar on his forehead that is the
                        only physical remnant of Voldemort's curse. Harry is the only
                        survivor of the Killing Curse, and in the wake of Voldemort's
                        mysterious defeat, the wizarding world begins to call him "the boy
                        who lived."
                    </p>
                </div>
            </nav>
            <main className="main">
                <div className="books">
                    <div className="">
                        <button onClick={shopping} className="flex flex-row">
                            <i class="ri-shopping-cart-2-line"></i>
                            shopping cart
                        </button>
                    </div>
                    <div className={classShopping ? "modal" : "modalNot"}>
                        <div className="carritoCompras">
                            <div className="title">
                                <h3>shopping cart</h3>
                                <button onClick={shopping}>X</button>
                            </div>
                            <div className="compras">
                                {items.map((item) => (
                                    <div className="date" key={item.id}>
                                        <img
                                            src={`https://image.tmdb.org/t/p/original${item.image}`}
                                            alt="Harry potter libros"
                                        />
                                        <div className="titlePriceDelete">
                                            <p>{item.title}</p>
                                            <p>
                                                unit price: <b>{item.price}</b>
                                            </p>
                                            <p>Total purchase: {item.total}</p>
                                            <button
                                                onClick={() => {
                                                    deleteC(item.id);
                                                }}
                                                className="delete"
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        {item.estado == true ? (
                                            <div className="buttons">
                                                <button
                                                    onClick={() => {
                                                        addItem(
                                                            item.image,
                                                            item.title,
                                                            item.title,
                                                            item.price,
                                                            item.id
                                                        );
                                                    }}
                                                >
                                                    +
                                                </button>
                                                <p>{item.count}</p>
                                                <button
                                                    onClick={() => {
                                                        less(item.id);
                                                    }}
                                                >
                                                    -
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="buttons">
                                                <p>Exhausted</p>
                                                <p>{item.count}</p>
                                                <button
                                                    onClick={() => {
                                                        less(item.id);
                                                    }}
                                                >
                                                    -
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="containerOptions">
                            <div className="total">
                                <p>
                                    Total: <b>{total}</b>
                                </p>
                            </div>
                            <div className="CancelarCompra">
                                <div className="optionCancel">
                                    <div className={classNameCancel ? "cancelPurchase" : "notcancelPurchase"}>
                                        <p>Do you want to continue with the cancellation?</p>
                                        <div>
                                            <button onClick={yesCancel}>Yes</button>
                                            <button
                                                onClick={() => {
                                                    setClassNameCancel(false);
                                                }}
                                            >
                                                Not
                                            </button>
                                        </div>
                                    </div>
                                    {classNameCancel == false && stateTextCancel == true ? (
                                        <div>
                                            <p>{classTextCancel} <button onClick={cerrarCancel}>Close</button></p>
                                        </div>
                                    ) : classNameCancel == false && stateTextCancel == false ? (
                                        <button onClick={cancelPurchase}>Cancel purchase</button>
                                    ) : null}
                                </div>
                                <div className="optionBuy">
                                    <div className={classNameBuy ? "buyBooks" : "notBuyBooks"}>
                                        <p>Do you want to continue with the purchase?</p>
                                        <div>
                                            <button onClick={yesBuy}>Yes</button>
                                            <button onClick={() => { setClassNameBuy(false) }}>
                                                Not
                                            </button>
                                        </div>
                                    </div>
                                    {classNameBuy == false && classNameExitBuy == true ? (
                                        <div>
                                            <p>{totalExitBuy} <button onClick={cerrar}>Close</button></p>
                                        </div>
                                    ) : classNameBuy == false && classNameExitBuy == false ? (
                                        <button onClick={optionBooks}>Buy</button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    {books.map((item) => (
                        <div className="item" key={item.id}>
                            <img
                                src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                                alt="Harry potter libros"
                            />
                            <div className="imgTitle">
                                <h4>{item.title}</h4>
                                <p>{item.overview}</p>
                                <p>
                                    Price: <b>{item.precio}</b>
                                </p>
                                <p>Available: {item.disponible}</p>
                                {item.disponible > 0 ? (
                                    <button
                                        onClick={() => {
                                            addItem(
                                                item.poster_path,
                                                item.title,
                                                item.overview,
                                                item.precio,
                                                item.id,
                                                item.disponible
                                            );
                                        }}
                                    >
                                        Add to car
                                    </button>
                                ) : (
                                    <p>Exhausted</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
};