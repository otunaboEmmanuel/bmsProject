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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.Utilities;
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
    static String DIRECTORY_PATH = "/u01/uploads/";
    @PostMapping("/add")
    public ResponseEntity<?> addBook(@RequestParam("title") String title,
                                     @RequestParam("author") String author,
                                     @RequestParam("price") String price,
                                     @RequestParam("level") String level,
                                     @RequestParam("availability") String availability,
                                     @RequestParam(value = "attachments", required = false) MultipartFile file,
                                     Book books) throws IOException {
//        Admins admin1=utility.validateUser(String.valueOf(adminId));
//        if (admin1.getRole().equalsIgnoreCase("ADMIN")){
        books.setTitle(title);
        books.setAuthor(author);
        books.setPrice(price);
        books.setLevel(level);
        books.setAvailability(availability);
        Map<String, String> uploadResponse=bookService.uploadImageToFileSystem(file,books);
        return ResponseEntity.status(HttpStatus.OK)
                .body(uploadResponse);
        //} else
          //  return new ResponseEntity<>(new Responses("99", "Unauthorized user"), HttpStatus.OK);
    }
    @PostMapping("/downloadRequest")
    public ResponseEntity<?> downloadImageFromFileSystem(@RequestBody LoginDto admin) throws IOException {
//        Admins admin1=utility.validateUser(String.valueOf(admin.getAdminId()));
//        if (admin1.getRole().equalsIgnoreCase("ADMIN")) {
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
    @DeleteMapping("/deleted")
    public String delete( @RequestBody LoginDto admin){
        Admins admin1=utility.validateUser(String.valueOf(admin.getAdminId()));
        if (admin1.getRole().equalsIgnoreCase("ADMIN")) {
        Book book1=bookRepository.findById(admin.getBookId()).orElse(null);
        if (book1==null){
            return "book doesn't exist";
        }else
            bookRepository.deleteById(admin.getBookId());
        return " Book successfully deleted";}
        else return "Unauthorized user";
    }
    @PostMapping("/update")
    public ResponseEntity<?>update(@RequestParam("title") String title,
                                   @RequestParam("author") String author,
                                   @RequestParam("price") String price,
                                   @RequestParam("level") String level,
                                   @RequestParam("availability") String availability,
                                   @RequestParam ("bookId") String id,
                                   @RequestParam("adminId") String adminId,
                                   @RequestParam(value = "attachments", required = false) MultipartFile file,
                                   Book books) throws IOException{
        Admins admin1=utility.validateUser(String.valueOf(adminId));
        if (admin1.getRole().equalsIgnoreCase("ADMIN")) {
            Book book1 = bookRepository.findById(Integer.valueOf(id)).orElse(null);
            if (book1 != null) {
                book1.setTitle(title);
                book1.setAuthor(author);
                book1.setPrice(price);
                book1.setLevel(level);
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
        }else return new ResponseEntity<>(new Responses("99", "Unauthorized user"), HttpStatus.OK);
    }
//     @GetMapping("/allbooks")
//        public List<Book> allBook(){
//         List<Book> books=bookRepository.findAll();
//         return books;
//     }
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
            bookDetail.setAvailability(book.getAvailability());
            bookDetail.setAuthor(book.getAuthor());
            bookDetail.setFilepath(book.getFilepath());
            bookDetails.add(bookDetail);
        }
        return new ResponseEntity<>(new bookResponse("00", "Success", bookDetails), HttpStatus.OK);
    }


}
