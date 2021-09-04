package com.cinema.uploadingfiles;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.sql.Blob;
import java.sql.Clob;

@Service
public class LobHelper {
    private final SessionFactory sessionFactory;

    @Autowired
    public LobHelper(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public Blob createBlob(InputStream content, long size) {
        Session session;
        try {
            session = sessionFactory.getCurrentSession();
        } catch (HibernateException e) {
            session = sessionFactory.openSession();
        }
        return session.getLobHelper().createBlob(content, size);
    }

    public Clob createClob(InputStream content, long size, Charset charset) {
        Session session;
        try {
            session = sessionFactory.getCurrentSession();
        } catch (HibernateException e) {
            session = sessionFactory.openSession();
        }
        return session.getLobHelper().createClob(new InputStreamReader(content, charset), size);
    }
}
