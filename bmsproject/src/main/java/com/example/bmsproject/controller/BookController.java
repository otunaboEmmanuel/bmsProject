package com.example.bmsproject.controller;

import com.example.bmsproject.dto.BookDetail;
import com.example.bmsproject.dto.LoginDto;
import com.example.bmsproject.entities.Admins;
import com.example.bmsproject.entities.Book;
import com.example.bmsproject.repository.BookRepository;
import com.example.bmsproject.responses.Response;
import com.example.bmsproject.responses.Responses;
import com.example.bmsproject.responses.bookResponse;
import com.example.bmsproject.service.BookService;
import com.example.bmsproject.service.BookServiceImp;
import com.example.bmsproject.service.Utility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.Utilities;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/book")
public class BookController {
    @Autowired
    private BookService bookService;
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private BookServiceImp bookServiceImp;
    @Autowired
    private Utility utility;
    static String DIRECTORY_PATH =  "/u01/uploads/";
    @PostMapping("/add")
    public ResponseEntity<?> addBook(@RequestParam("title") String title,
                                     @RequestParam("author") String author,
                                     @RequestParam("price") String price,
                                     @RequestParam("level") String level,
                                     @RequestParam("quantity") String quantity,
                                     @RequestParam("availability") String availability,
                                     @RequestParam(value = "attachments", required = false) MultipartFile file,
                                     Book books) throws IOException {
        books.setTitle(title);
        books.setAuthor(author);
        books.setPrice(price);
        books.setLevel(level);
        books.setQuantity(quantity);
        books.setAvailability(availability);
        Map<String, String> uploadResponse=bookService.uploadImageToFileSystem(file,books);
        return ResponseEntity.status(HttpStatus.OK)
                .body(uploadResponse);
    }
    @GetMapping("/downloadRequest")
    public ResponseEntity<?> downloadImageFromFileSystem(@RequestBody LoginDto admin) throws IOException {
//
            // Retrieve the user by the provided requestId (or email)
            Book book = bookRepository.findById(admin.getBookId()).orElse(null);

            if (book == null || book.getFilepath() == null) {
                // If the user or file path is not found, return a 404 Not Found response
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or image not found");
            }

            // Retrieve the image data from the file system using the file path stored for the user
            byte[] imageData = bookService.downloadImageFromFileSystem(book.getFilepath());

            // Determine the content type (MIME type) of the image (e.g., "image/jpeg")
            String contentType = book.getType();  // Assumes the 'type' field stores the MIME type

            // Return the image data in the response, along with the correct content type
            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.valueOf(contentType))  // Set the appropriate content type
                    .body(imageData);// Return the image binary data
        //}else return new ResponseEntity<>(new Responses("99", "Unauthorized user"), HttpStatus.OK);
    }

  @DeleteMapping("/deleted/{id}")
    public String delete(@PathVariable Integer id){
    Book users1=bookRepository.findById(id).orElse(null);
    if (users1==null){
        return "book doesn't exist";
    }else
        bookRepository.deleteById(id);
    return " Book successfully deleted";
}
    @PutMapping("/update/{bookId}")
    public ResponseEntity<?>update(@RequestParam("title") String title,
                                   @RequestParam("author") String author,
                                   @RequestParam("price") String price,
                                   @RequestParam("level") String level,
                                   @RequestParam("quantity") String quantity,
                                   @RequestParam("availability") String availability,
                                   @PathVariable Integer bookId,
                                   @RequestParam(value = "attachments", required = false) MultipartFile file) throws IOException{
            Book book1 = bookRepository.findById(bookId).orElse(null);
            if (book1 != null) {
                book1.setTitle(title);
                book1.setAuthor(author);
                book1.setPrice(price);
                book1.setLevel(level);
                book1.setQuantity(quantity);
                book1.setAvailability(availability);
                if (file != null) {
                    String filePath = bookServiceImp.saveFileToStorage(file);
                    book1.setFilepath(DIRECTORY_PATH + filePath);
                    book1.setType(file.getContentType());
                    book1.setName(file.getOriginalFilename());
                }
                bookRepository.save(book1);
                return new ResponseEntity<>(new Responses("00", " book successfully updated"), HttpStatus.OK);
            } else
                return new ResponseEntity<>(new Responses("99", " book id not found"), HttpStatus.OK);
//        }else return new ResponseEntity<>(new Responses("99", "Unauthorized user"), HttpStatus.OK);
    }

    @GetMapping("/allBooks")
  public ResponseEntity<?> getStudents() {
        List<Book> bookList = bookRepository.findAll();

        if (bookList.isEmpty()) {
            return new ResponseEntity<>(new Responses("99", "No book found"), HttpStatus.NOT_FOUND);
        }

        List<BookDetail> bookDetails = new ArrayList<>();
        for (Book book : bookList) {
            BookDetail bookDetail = new BookDetail();
            bookDetail.setBookId(book.getId());
            bookDetail.setTitle(book.getTitle());
            bookDetail.setPrice(book.getPrice());
            bookDetail.setLevel(book.getLevel());
            bookDetail.setQuantity(book.getQuantity());
            bookDetail.setAvailability(book.getAvailability());
            bookDetail.setAuthor(book.getAuthor());
            bookDetail.setFilepath(book.getFilepath());
            bookDetails.add(bookDetail);
        }
        return new ResponseEntity<>(new bookResponse("00", "Success", bookDetails), HttpStatus.OK);
    }
    @GetMapping("/images/{bookId}")
    public ResponseEntity<Resource> getImage(@PathVariable Integer bookId) throws IOException {
        // Retrieve the book from the database
        Book book = bookRepository.findById(bookId).orElse(null);

        if (book == null || book.getFilepath() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Load the file from the system
        File file = new File(book.getFilepath());
        if (!file.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Convert to a Spring Resource
        Resource resource = new UrlResource(file.toURI());

        // Determine the content type (defaulting to JPEG if unknown)
        String contentType = book.getType() != null ? book.getType() : "image/jpeg";

        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(contentType))
                .body(resource);
    }
    @GetMapping("/find/{bookId}")
    public ResponseEntity<?> findBookById(@PathVariable Integer bookId){
        Book book=bookRepository.findById(bookId).orElse(null);
        if (book==null){
            return new ResponseEntity<>(new Responses("99","book not found"), HttpStatus.OK);
        }else {
            return new ResponseEntity<>(book,HttpStatus.OK);
        }
    }


}
