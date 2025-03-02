"use client";
import { useEffect, useState } from 'react';
import SlideShow from '../home/slides';
import ProductGallery from './images_slides';

interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    originalPrice: number;
    discount: number;
    image: string;
    images: string[] | [];
    rating: number;
    sold: number;
    colors: string[];
    sizes: string;
    delivery_days: number;
    
}

interface Promo {
    product_id: string;
    discount: number;
    status: string;
}

interface ItemProps {
    product: Product;
}

const Item = ({ product }: ItemProps) => {
    const [num, setNum] = useState(1); // Quantity
    const [price, setPrice] = useState<number>(0); // Product price with discount
    const [isInCart, setIsInCart] = useState(false);
    const [discountId, setDiscountId] = useState<Promo[]>([]);
 
    useEffect(() => {
        fetch(`/api/products/discount`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch promo");
                }
                return response.json();
            })
            .then((data) => {
                setDiscountId(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    useEffect(() => {
        if (!Array.isArray(discountId)) {
            console.error("Invalid discount data format:", discountId);
            setPrice(product.price);
            return;
        }

        // Filter for active discounts matching the product ID
        const validDiscounts = discountId.filter(
            (disc) =>
                disc.product_id == product.id &&
                disc.status == "active"
        );

        if (validDiscounts.length > 0) {
            const activeDiscount = validDiscounts[0]; // Take the first valid discount
            setPrice(
                product.price - product.price * (activeDiscount.discount / 100)
            );
        } else {
            setPrice(product.price); // No valid discount found
        }
    }, [discountId, product]);

    
 
    // Converting string colors to array
    const colorsArray = product.colors || [];

    // Formatting date
    const formatDate = (date: Date) => {
        return date.toLocaleString('default', { month: 'short' }) + ', ' + date.getDate() + ' ' + date.getFullYear();
    };

    // Get today's date and calculate the future date for delivery
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + product.delivery_days);

    // Increment quantity
    const increment = () => {
        setNum(prevNum => prevNum + 1);
    };

    // Decrement quantity
    const decrement = () => {
        if (num > 1) {
            setNum(prevNum => prevNum - 1);
        }
    };

    // Function to handle adding item to cart in local storage
    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);

        if (existingItemIndex !== -1) {
            // If the item is already in the cart, increase the amount
            cart[existingItemIndex].amount += num;
        } else {
            // Create a new item object with explicit property names
            const newItem = {
                id: product.id,
                name: product.name,
                image: product.image,
                price: price,
                size: product.sizes,
                color: product.colors,
                amount: num, // Add selected quantity
            };
            cart.push(newItem);
        }

        // Update local storage with the new cart
        localStorage.setItem("cart", JSON.stringify(cart));
        setIsInCart(true); // Update the state to reflect the item is added
    };


    // Converting string colors and sizes to arrays
    const str = "" + product.colors;
    const strSizes = "" + product.sizes;
    const arr = str.split(",");
    const arrSizes = strSizes.split(",");


    return (
        <>
            <div className="title font-bold capitalize text-slate-500 text-sm flex px-6 mx-2 pt-3  mt-4">
             <h1>Products</h1>
             <span className='mx-1  bi bi-dot'></span>
             <h1>{product.category}</h1>
             <span className="mx-1 bi bi-dot"></span>
             <h1>{product.name}</h1>
            </div>
            <div className="px-4 flex flex-col justify-between md:flex-row bg-white">
                <div className="product w-full md:w-[50%]">
                    
                    {/** <div className="album flex flex-col ">
                        <div className="main-pic p-4 h-[60vh] mx-4 my-3 w-full shadow-sm rounded-md bg-zinc-100">
                            <img src={product.image} alt="" className="w-full h-full object-contain"/>
                        </div>
                        <div className="other p-2 flex flex-row w-[50vw] overflow-hidden overflow-x-visible">
                            {product.images.map((src, index) => (
                                <div key={index} className="pic w-[99%] h-[30vh] p-1 rounded-md bg-zinc-100 mx-1 cursor-pointer">
                                    <img src={src} alt="" className="w-full h-full object-cover"/>
                                </div>
                            ))}
                        </div>
                    </div> 
                    */}
                    <ProductGallery image={product.image} images={product.images}/>
                </div>
                <div className="details w-full md:w-[40%] lg:w-[40%]">
                    <div className="info">
                        <div className="head mb-3">
                            <div className='flex text-sm justify-between items-center'>
                             <div className='flex items-center '>
                                <i className="bi bi-bag-fill"></i>
                                <span className='mx-2'>Shop</span>
                                
                             </div>
                              <h4 className='text-slate-300 uppercase'>{product.category}</h4>
                            </div>
                            <h1 className='text-xl font-bold mt-3'>{product.name}</h1>
                            <p className='my-[1px] mx-1 text-xs text-slate-300'>{product.description}</p>
                        </div>
                        <div className="more text-xs flex">
                            <div className="reviews ">
                                <i className="bi bi-star-fill text-orange-300 mr-1"></i>
                                <i className="bi bi-star-fill text-orange-300 mr-1"></i>
                                <i className="bi bi-star-fill text-orange-300 mr-1"></i>
                                <i className="bi bi-star-fill text-orange-300 mr-1"></i>
                                <i className="bi bi-star-fill text-orange-100"></i>
                                <span className="font-bold mx-5">4.5 reviews :</span>
                            </div>
                            <div className="sold-items text-red-400 font-bold">0 Sold</div>
                        </div>
                       
                        {discountId.some(disc => disc.product_id == product.id && disc.status == "active") ? (
                            <>
                                <div className="discount my-3 text-lg text-orange-200 bg-red-50 font-bold px-4 py-2 w-min text-nowrap">
                                    <span className="text-red-500">
                                    {discountId.find((disc) => disc.product_id == product.id && disc.status == "active")?.discount || 0}% OFF
                                    </span> Discount
                                </div>
                                <div className="price text-2xl font-bold my-4">
                                    <div className="text-sm text-slate-400">
                                        <del>
                                            {new Intl.NumberFormat('en-US', {
                                                style: 'decimal',
                                                maximumFractionDigits: 0,
                                            }).format(product.price)} RWF
                                        </del>
                                    </div>
                                    <span>
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'decimal',
                                            maximumFractionDigits: 0,
                                        }).format(price)} RWF
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="price text-2xl font-bold my-4">
                                {new Intl.NumberFormat('en-US', {
                                    style: 'decimal',
                                    maximumFractionDigits: 0,
                                }).format(price)} RWF
                            </div>
                        )}
                        
                        <div className="colors border-t mt-3">
                            <div>Colors: </div>
                            <div className="my-2 flex flex-wrap">
                                {arr.map((color, index) => (
                                    <span style={{ backgroundColor: color }}  key={index} className={`py-1 px-4 rounded shadow m-2 text-sm text-slate-500 uppercase cursor-pointer hover:shadow-lg`}>
                                        {color}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="shipping">
                            <h4 className="font-bold text-sm">Delivery note: </h4>
                            <p className="py-2 text-slate-600">
                                Note that this item might be delivered in range from
                                <br /><span className="text-green-400 font-semibold">  Today - {formatDate(futureDate)}</span>
                            </p>
                        </div>
                        <div className="shop-q border-t pt-2">
                            <h4 className="font-bold text-sm mb-3"><i>How many to deliver to you? </i></h4>
                            <div className="flex w-min text-gray-600">
                                <button
                                    className="w-[50px] py-1 px-3 font-bold text-[17px] text-center border border-slate-200"
                                    onClick={decrement}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={num}
                                    id="quantity"
                                    className="w-[90px] py-2 outline-none border border-slate-200 px-3 text-center"
                                    onChange={(e) => setNum(Number(e.target.value))}
                                />
                                <button
                                    className="w-[50px] py-1 px-3 font-bold text-[17px] text-center border border-slate-200"
                                    onClick={increment}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='my-3 '>
                       <h4 className="font-bold text-sm ">Size:  </h4>
                        <div className="flex flex-wrap">
                            {arrSizes.map((item, index) => (
                                <div 
                                key={index} 
                                className={`py-1 px-3 m-1 border rounded hover:bg-slate-100 uppercase`} 
                                title={item}
                                >
                                  {item}
                                </div>
                            ))}
                         </div>
                    </div>
                    <div className="cart flex w-full justify-between flex-wrap">
                        <button 
                        className={`px-4 py-2 ${isInCart? 'bg-green-400':'bg-slate-950'}  text-white my-1 w-[80%] rounded-lg`}
                        onClick={addToCart} disabled={isInCart}
                        
                        >
                            <i className="bi bi-cart mr-2"></i>{isInCart ? "Added ✔️" : "Add to Cart"}
                        </button>
                        <button className="px-4 py-2 bg-stone-100 text-slate-400 my-1 w-[15%] rounded-lg">
                            <i className="bi bi-heart text-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
    }
    
    export default Item;
    