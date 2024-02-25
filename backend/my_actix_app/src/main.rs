use actix_web::{get, App, HttpRequest, HttpResponse, HttpServer, Responder};
use mysql::prelude::*;
use mysql::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, PartialEq, Eq, Serialize, Deserialize)]
struct Memo {
    id: Option<i32>,
    title: String,
    memo: String,
}

impl Memo {
    fn from_row(row: mysql::Row) -> Memo {
        let (id, title, memo): (Option<i32>, String, String) = (
            row.get("ID").unwrap_or(None),
            row.get("TITLE").unwrap_or(String::new()),
            row.get("MEMO").unwrap_or(String::new()),
        );
        Memo { id, title, memo }
    }
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new().service(hello)
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
